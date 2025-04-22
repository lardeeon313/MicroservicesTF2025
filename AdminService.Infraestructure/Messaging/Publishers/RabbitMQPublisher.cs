using RabbitMQ.Client;
using RabbitMQ.Client.Events;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Infraestructure.Messaging.Publishers
{

    public class RabbitMQPublisher
    {
        public async Task PublishMessageQueue(string routingKey, string eventData)
        {
            try
            {

            var factory = new ConnectionFactory 
            { 
                HostName = "rabbitmq",
                UserName = "guest",
                Password = "guest"

            };
            using var connection = await factory.CreateConnectionAsync();
            using var channel = await connection.CreateChannelAsync();

            await channel.QueueDeclareAsync(queue: "hello", durable: false, exclusive: false, autoDelete: false,
                arguments: null);

            const string message = "Hello World!";
            var body = Encoding.UTF8.GetBytes(message);

            await channel.BasicPublishAsync(exchange: string.Empty, routingKey: "hello", body: body);
            Console.WriteLine($" [x] Sent {message}");

            }
            catch
            {
                Console.WriteLine("❌ Error al publicar en RabbitMQ:");
            }
            Console.WriteLine(" Press [enter] to exit.");
            Console.ReadLine();
        }
    }
}
