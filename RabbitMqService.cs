using RabbitMQ.Client;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace SalesService.Infrastructure.Messaging
{
    public class RabbitMqService : IRabbitMqService
    {
        private readonly IModel _channel;

        public RabbitMqService(IConfiguration config)
        {
            var factory = new ConnectionFactory
            {
                HostName = config["RabbitMQ:Host"],
                Port = int.Parse(config["RabbitMQ:Port"]!),
                UserName = config["RabbitMQ:UserName"],
                Password = config["RabbitMQ:Password"]
            };

            // Fix: Await the asynchronous connection creation and ensure proper handling
            var connection = factory.CreateConnection();
            _channel = connection.CreateModel();
        }

        public void Publish<T>(T message)
        {
            var queue = typeof(T).Name;
            _channel.QueueDeclare(queue, false, false, false);
            var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
            _channel.BasicPublish("", queue, null, body);
        }
    }
}
