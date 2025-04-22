using SalesService.Application.Commands.Handlers.Interfaces;
using SalesService.Domain.Entities.DummyEntitie;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Messaging.Publisher;
using SharedKernel.IntegrationEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Handlers
{
    public class CreateDummyCommandHandler(IDummyRepository _repository, IRabbitMQPublisher _publisher) : ICreateDummyCommandHandler
    {
        private readonly IDummyRepository repository = _repository;
        private readonly IRabbitMQPublisher publisher = _publisher;

        public async Task<Dummy> Handle(CreateDummyCommand command)
        {
            var dummy = new Dummy(command.Nombre);
            await _repository.AddAsync(dummy);

            var integrationEvent = new DummyCreatedIntegrationEvent
            {
                Id = dummy.Id,
                Nombre = dummy.Nombre,
                FechaCreacion = dummy.FechaCreacion
            };

            await _publisher.PublishAsync(integrationEvent, "dummy_created_queue");

            return dummy;
        }

        
    }
}
