using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Infraestructure.Messaging.Publishers
{
    public interface IRabbitMQPublisher
    {
        Task PublishAsync<T>(T message, string queueName);
    }

}
