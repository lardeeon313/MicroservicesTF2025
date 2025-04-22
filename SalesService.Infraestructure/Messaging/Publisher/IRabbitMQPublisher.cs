using SalesService.Infrastructure.Messaging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Infraestructure.Messaging.Publisher
{
    public interface IRabbitMQPublisher
    {
        void Publish(OrderCreatedEvent @event);
        Task PublishAsync<T>(T message, string queueName);
    }

}
