// En DepotService.Infraestructure.Messaging.Publisher.RabbitMQPublisher.cs

using RabbitMQ.Client;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace DepotService.Infraestructure.Messaging.Publisher
{
    public class RabbitMQPublisher : IRabbitMQPublisher
    {
        private readonly IConfiguration _config;

        public RabbitMQPublisher(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// MÉTODO 1: Envía a una cola específica.
        /// </summary>
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

            // Declara la cola (como lo hacías antes)
            await channel.QueueDeclareAsync(queue: queueName,
                durable: true,
                exclusive: false,
                autoDelete: false);

            var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));

            // Publica usando el exchange por defecto ("")
            await channel.BasicPublishAsync(
                exchange: "",
                routingKey: queueName,
                body: body
            );

            Console.WriteLine($"✅ [Publicado a COLA] '{queueName}': {JsonSerializer.Serialize(message)}");
        }

        /// <summary>
        /// MÉTODO 2: El nuevo. Envía a un Exchange (Pub/Sub).
        /// </summary>
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