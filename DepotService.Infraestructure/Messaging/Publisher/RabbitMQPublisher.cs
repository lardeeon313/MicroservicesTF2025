using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Infraestructure.Messaging.Publisher
{
    public class RabbitMQPublisher : IRabbitMQPublisher
    {
        public Task PublishAsync<T>(T message, string queueName)
        {
            throw new NotImplementedException();
        }
    }
}
