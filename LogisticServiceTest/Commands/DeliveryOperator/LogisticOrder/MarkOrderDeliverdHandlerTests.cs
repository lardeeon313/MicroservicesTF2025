using FluentAssertions;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.MarkOrderDelivered;
using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using LogisticService.Infraestructure.Messaging.Publisher;
using Moq;
using SharedKernel.IntegrationEvents.LogisticEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Test.Commands.DeliveryOperator.LogisticOrder
{
    /// <summary>
    /// Pruebas unitarias para MarkOrderDeliveredCommandHandler
    /// </summary>
    public class MarkOrderDeliveredHandlerTest
    {
        private readonly Mock<ILogisticOrderRepository> _repositoryMock;
        private readonly Mock<IRabbitMQPublisher> _publisherMock;
        private readonly MarkOrderDeliveredCommandHandler _handler;

        public MarkOrderDeliveredHandlerTest()
        {
            _repositoryMock = new Mock<ILogisticOrderRepository>();
            _publisherMock = new Mock<IRabbitMQPublisher>();

            // el handler usa logger, pero en tus tests no verificás logs → simplemente mock vacío
            var loggerMock = new Mock<Microsoft.Extensions.Logging.ILogger<MarkOrderDeliveredCommandHandler>>();

            _handler = new MarkOrderDeliveredCommandHandler(
                _publisherMock.Object,
                _repositoryMock.Object,
                loggerMock.Object
            );
        }

        // =====================================================================
        // Caso 1: Orden encontrada, en estado OnTheWay y pago con tarjeta
        // =====================================================================
        [Fact(DisplayName = "Debe marcar como Delivered si el pago NO es Cash")]
        public async Task Handle_ShouldMarkDelivered_WhenPaymentIsNotCash()
        {
            // Arrange
            var command = new MarkOrderDeliveredCommand(10);

            var order = new Domain.Entities.LogisticOrder
            {
                Id = 10,
                DepotOrderId = 20,
                SalesOrderId = 30,
                Status = OrderStatus.OnTheWay,
                PaymentType = PaymentType.Current_Account,
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(order);
            _repositoryMock.Setup(r => r.AddStatusHistoryAsync(It.IsAny<OrderStatusHistory>())).Returns(Task.CompletedTask);
            _repositoryMock.Setup(r => r.UpdateAsync(order)).Returns(Task.CompletedTask);

            // Act
            var result = await _handler.MarkOrderDelivered(command);

            // Assert
            result.Should().BeTrue();
            order.Status.Should().Be(OrderStatus.Delivered);

            _repositoryMock.Verify(r => r.UpdateAsync(order), Times.Once);
            _repositoryMock.Verify(r => r.AddStatusHistoryAsync(It.IsAny<OrderStatusHistory>()), Times.Once);
        }

        // =====================================================================
        // Caso 2: Pago en efectivo → pasa a PendingCashVerification
        // =====================================================================
        [Fact(DisplayName = "Debe pasar a PendingCashVerification cuando el pago es Cash")]
        public async Task Handle_ShouldMarkPendingCashVerification_WhenPaymentIsCash()
        {
            // Arrange
            var command = new MarkOrderDeliveredCommand(50);

            var order = new Domain.Entities.LogisticOrder
            {
                Id = 50,
                DepotOrderId = 100,
                SalesOrderId = 200,
                Status = OrderStatus.OnTheWay,
                PaymentType = PaymentType.Cash
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(50)).ReturnsAsync(order);
            _repositoryMock.Setup(r => r.AddStatusHistoryAsync(It.IsAny<OrderStatusHistory>())).Returns(Task.CompletedTask);
            _repositoryMock.Setup(r => r.UpdateAsync(order)).Returns(Task.CompletedTask);

            // Act
            var result = await _handler.MarkOrderDelivered(command);

            // Assert
            result.Should().BeTrue();
            order.Status.Should().Be(OrderStatus.PendingCashVerification);

            _repositoryMock.Verify(r => r.UpdateAsync(order), Times.Once);
            _repositoryMock.Verify(r => r.AddStatusHistoryAsync(It.IsAny<OrderStatusHistory>()), Times.Once);
        }

        // =====================================================================
        // Caso 3: Orden no encontrada
        // =====================================================================
        [Fact(DisplayName = "Debe retornar false si la orden no existe")]
        public async Task Handle_ShouldReturnFalse_WhenOrderNotFound()
        {
            // Arrange
            var command = new MarkOrderDeliveredCommand(10);
            _repositoryMock.Setup(r => r.GetByIdAsync(10)).ReturnsAsync((Domain.Entities.LogisticOrder?)null);

            // Act
            var result = await _handler.MarkOrderDelivered(command);

            // Assert
            result.Should().BeFalse();

        }

        // =====================================================================
        // Caso 4: Estado incorrecto
        // =====================================================================
        [Fact(DisplayName = "Debe retornar false si el estado no es OnTheWay")]
        public async Task Handle_ShouldReturnFalse_WhenStatusIsInvalid()
        {
            // Arrange
            var command = new MarkOrderDeliveredCommand(10);

            var order = new Domain.Entities.LogisticOrder
            {
                Id = 10,
                Status = OrderStatus.PendingDelivery, // estado incorrecto
                PaymentType = PaymentType.Credit_Card
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(order);

            // Act
            var result = await _handler.MarkOrderDelivered(command);

            // Assert
            result.Should().BeFalse();

        }
    }
}
