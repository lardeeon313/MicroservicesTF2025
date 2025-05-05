using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Infraestructure.Messaging.Publisher
{
    public interface IRabbitMQPublisher
    {
        Task PublishAsync<T>(T message, string queueName);
    }

}
