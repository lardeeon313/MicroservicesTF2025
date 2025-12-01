using LogisticService.Application.Commands.LogisticManager.DeliveryZone.CreateDeliveryZone;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Test.Commands.LogisticManager.DeliveryZone
{
    public class CreateDeliveryZoneHandlerTest
    {
        private readonly Mock<IDeliveryZoneRepository> _repositoryMock;
        private readonly Mock<ILogger<CreateDeliveryZoneCommandHandler>> _loggerMock;
        private readonly CreateDeliveryZoneCommandHandler _handler;

        public CreateDeliveryZoneHandlerTest()
        {
            _repositoryMock = new Mock<IDeliveryZoneRepository>();
            _loggerMock = new Mock<ILogger<CreateDeliveryZoneCommandHandler>>();
            _handler = new CreateDeliveryZoneCommandHandler(_repositoryMock.Object, _loggerMock.Object);
        }

        [Fact(DisplayName = "Debe crear una zona de entrega y retornar el DTO correspondiente")]
        public async Task HandleAsync_ShouldCreateZone_AndReturnDto()
        {
            // Arrange
            var command = new CreateDeliveryZoneCommand("Zona Norte", "Región norte de entregas");
            Domain.Entities.DeliveryZone? addedZone = null;

            // Capturamos la entidad que se envía al repositorio
            _repositoryMock
                .Setup(r => r.AddAsync(It.IsAny<Domain.Entities.DeliveryZone>()))
                .Callback<Domain.Entities.DeliveryZone>(z => addedZone = z)
                .Returns(Task.CompletedTask);

            // Act
            var result = await _handler.HandleAsync(command);

            // Assert
            Assert.NotNull(addedZone);
            Assert.Equal("Zona Norte", addedZone!.Name);
            Assert.Equal("Región norte de entregas", addedZone.Description);

            Assert.Equal(addedZone.Id, result.Id);
            Assert.Equal(addedZone.Name, result.Name);
            Assert.Equal(addedZone.Description, result.Description);

            _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Domain.Entities.DeliveryZone>()), Times.Once);
        }
    }
}
