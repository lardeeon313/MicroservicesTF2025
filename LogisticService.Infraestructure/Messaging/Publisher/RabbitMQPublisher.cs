using Microsoft.Extensions.Configuration;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace LogisticService.Infraestructure.Messaging.Publisher
{
    public class RabbitMQPublisher(IConfiguration config) : IRabbitMQPublisher
    {
        private readonly IConfiguration _config = config;

        public async Task PublishAsync<T>(T message, string queueName)
        {
            var factory = new ConnectionFactory()
            {
                HostName = _config["RabbitMQ:Host"] ?? "rabbitmq",
                Port = int.Parse(_config["RabbitMQ:Port"] ?? "5672"),
                UserName = _config["RabbitMQ:Username"] ?? "guest",
                Password = _config["RabbitMQ:Password"] ?? "guest"
            };

            using var connection = await factory.CreateConnectionAsync();
            using var channel = await connection.CreateChannelAsync();

            await channel.QueueDeclareAsync(queue: queueName,
                durable: true,
                exclusive: false,
                autoDelete: false);


            var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
            //var props = await channel.CreateBasicPropertiesAsync();
            //props.Persistent = true; // Make the message persistent

            await channel.BasicPublishAsync(exchange: "", routingKey: queueName, body: body/*basicProperties: props*/);

            Console.WriteLine($"✅ [x] Evento publicado en la cola '{queueName}': {JsonSerializer.Serialize(message)}");
        }

        public async Task PublishToExchangeAsync<T>(T message, string exchangeName, string type = "fanout", string routingKey = "")
        {
            var factory = new ConnectionFactory()
            {
                HostName = _config["RabbitMQ:Host"] ?? "rabbitmq",
                Port = int.Parse(_config["RabbitMQ:Port"] ?? "5672"),
                UserName = _config["RabbitMQ:Username"] ?? "guest",
                Password = _config["RabbitMQ:Password"] ?? "guest"
            };

            using var connection = await factory.CreateConnectionAsync();
            using var channel = await connection.CreateChannelAsync();

            // Declara el Exchange
            await channel.ExchangeDeclareAsync(
                exchange: exchangeName,
                type: type, // "fanout" por defecto
                durable: true,
                autoDelete: false
            );

            var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));

            // Publica al Exchange
            await channel.BasicPublishAsync(
                exchange: exchangeName,
                routingKey: routingKey, // "" por defecto
                body: body
            );

            Console.WriteLine($"✅ [Publicado a EXCHANGE] '{exchangeName}': {JsonSerializer.Serialize(message)}");
        }
    }
}
