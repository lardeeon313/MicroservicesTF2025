using FluentAssertions;
using LogisticService.API.RequestDtos.LogisticOrders;
using LogisticService.Application.Commands.LogisticManager.LogisticOrder.VerifiedOrder;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using LogisticService.Infraestructure.Messaging.Publisher;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Test.Commands.LogisticManager.LogisticOrder
{
    public class VerifiedOrderHandlerTests
    {
        private readonly Mock<ILogisticOrderRepository> _repositoryMock;
        private readonly Mock<IRabbitMQPublisher> _publisherMock;
        private readonly Mock<ILogger<VerifiedOrderCommandHandler>> _loggerMock;

        private readonly VerifiedOrderCommandHandler _handler;

        public VerifiedOrderHandlerTests()
        {
            _repositoryMock = new Mock<ILogisticOrderRepository>();
            _publisherMock = new Mock<IRabbitMQPublisher>();
            _loggerMock = new Mock<ILogger<VerifiedOrderCommandHandler>>();

            _handler = new VerifiedOrderCommandHandler(
                _publisherMock.Object,
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        // ---------------------------------------------------------
        // 1️⃣ ORDEN NO EXISTE
        // ---------------------------------------------------------
        [Fact(DisplayName = "Debe retornar false cuando la orden no es encontrada")]
        public async Task VerifiedOrderHandleAsync_ShouldReturnFalse_WhenOrderNotFound()
        {
            // Arrange
            var command = new VerifiedOrderCommand(100);

            _repositoryMock
                .Setup(r => r.GetByIdAsync(command.LogisticOrderId))
                .ReturnsAsync((Domain.Entities.LogisticOrder?)null);

            // Act
            var result = await _handler.VerifiedOrderHandleAsync(command);

            // Assert
            result.Should().BeFalse();

            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Warning,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) =>
                        v.ToString()!.Contains("No se encontró la orden logística")
                    ),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()
                ),
                Times.Once);

            _repositoryMock.Verify(x => x.UpdateAsync(It.IsAny<Domain.Entities.LogisticOrder>()), Times.Never);            
        }

        // ---------------------------------------------------------
        // 2️⃣ REGLA DE DOMINIO FALLA (estado inválido)
        // ---------------------------------------------------------
        [Fact(DisplayName = "Debe retornar false cuando la validación de dominio falla")]
        public async Task VerifiedOrderHandleAsync_ShouldReturnFalse_WhenDomainValidationFails()
        {
            // Arrange
            var command = new VerifiedOrderCommand(10);

            var fakeOrder = new Domain.Entities.LogisticOrder
            {
                Status = OrderStatus.Delivered // ❌ no es PendingVerification
            };

            _repositoryMock
                .Setup(r => r.GetByIdAsync(command.LogisticOrderId))
                .ReturnsAsync(fakeOrder);

            // Act
            var result = await _handler.VerifiedOrderHandleAsync(command);

            // Assert
            result.Should().BeFalse();

            // Verifica que nunca actualiza ni publica el evento
            _repositoryMock.Verify(x => x.UpdateAsync(It.IsAny<Domain.Entities.LogisticOrder>()), Times.Never);           

            // Verifica que logueó el error de validación
            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Warning,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) =>
                        v.ToString()!.Contains("Error de validación al verificar la orden")
                    ),
                    It.IsAny<InvalidOperationException>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()
                ),
                Times.Once);
        }

        // ---------------------------------------------------------
        // 3️⃣ FLUJO EXITOSO (UPDATE + EVENTO + LOGS)
        // ---------------------------------------------------------
        [Fact(DisplayName = "Debe verificar la orden correctamente cuando los datos son válidos")]
        public async Task VerifiedOrderHandleAsync_ShouldVerifyOrder_WhenValid()
        {
            // Arrange
            var command = new VerifiedOrderCommand(15);

            var fakeOrder = new Domain.Entities.LogisticOrder
            {
                Id = 15,
                SalesOrderId = 200,
                DepotOrderId = 300,
                Status = OrderStatus.PendingVerification
            };

            _repositoryMock
                .Setup(r => r.GetByIdAsync(command.LogisticOrderId))
                .ReturnsAsync(fakeOrder);

            _repositoryMock
                .Setup(r => r.UpdateAsync(fakeOrder))
                .Returns(Task.CompletedTask);


            // Act
            var result = await _handler.VerifiedOrderHandleAsync(command);

            // Assert
            result.Should().BeTrue();

            // El estado debe haber cambiado a Verified
            fakeOrder.Status.Should().Be(OrderStatus.Verified);

            // Se debe haber registrado un historial
            fakeOrder.StatusHistory.Should().HaveCount(1);
            fakeOrder.StatusHistory[0].NewStatus.Should().Be(OrderStatus.Verified);

            _repositoryMock.Verify(r => r.UpdateAsync(fakeOrder), Times.Once);

            // Logueo final OK
            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) =>
                        v.ToString()!.Contains("ha sido verificada")
                    ),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()
                ),
                Times.Once
            );
        }
    }
}
