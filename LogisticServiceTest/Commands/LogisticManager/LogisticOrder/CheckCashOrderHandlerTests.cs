using LogisticService.Application.Commands.LogisticManager.LogisticOrder.CheckCashOrder;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Test.Commands.LogisticManager.LogisticOrder
{
    public class CheckCashOrderHandlerTests
    {
        private readonly Mock<ILogisticOrderRepository> _repositoryMock;
        private readonly Mock<ILogger<CheckCashOrderCommandHandler>> _loggerMock;
        private readonly CheckCashOrderCommandHandler _handler;

        public CheckCashOrderHandlerTests()
        {
            _repositoryMock = new Mock<ILogisticOrderRepository>();
            _loggerMock = new Mock<ILogger<CheckCashOrderCommandHandler>>();

            _handler = new CheckCashOrderCommandHandler(
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        // 1️⃣ Orden no encontrada -> false
        [Fact(DisplayName = " Debe retornar false cuando la orden no existe")]
        public async Task CheckCashHandleAsync_ShouldReturnFalse_WhenOrderNotFound()
        {
            var command = new CheckCashOrderCommand(1);

            _repositoryMock.Setup(r => r.GetByIdAsync(1))
                           .ReturnsAsync((Domain.Entities.LogisticOrder)null!);

            var result = await _handler.CheckCashHandleAsync(command);

            Assert.False(result);

            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.LogisticOrder>()), Times.Never);
        }

        // 2️⃣ Orden encontrada -> CheckCash ejecutado y UpdateAsync llamado
        [Fact( DisplayName = " Debe verificar la orden y actualizar si se encuentra")]
        public async Task CheckCashHandleAsync_ShouldVerifyOrderAndUpdate()
        {
            var command = new CheckCashOrderCommand(1);

            // Creamos una orden real con el estado adecuado
            var order = new Domain.Entities.LogisticOrder(10, 20)
            {
                Status = OrderStatus.PendingCashVerification,
                PaymentType = PaymentType.Cash
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);

            var result = await _handler.CheckCashHandleAsync(command);

            Assert.True(result);

            // Verifica que se actualizó la orden
            _repositoryMock.Verify(r => r.UpdateAsync(order), Times.Once);

            // Verifica que el estado cambió a CashVerified
            Assert.Equal(OrderStatus.CashVerified, order.Status);
        }

        // 3️⃣ UpdateAsync debe ser llamado solo una vez si todo sale bien
        [Fact(DisplayName = " Debe llamar a UpdateAsync solo una vez")]
        public async Task CheckCashHandleAsync_ShouldCallUpdateOnce()
        {
            var command = new CheckCashOrderCommand(5);

            var order = new Domain.Entities.LogisticOrder(10, 20)
            {
                Status = OrderStatus.PendingCashVerification,
                PaymentType = PaymentType.Cash
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(5))
                           .ReturnsAsync(order);

            var result = await _handler.CheckCashHandleAsync(command);

            Assert.True(result);

            // Se debe llamar exactamente una vez a UpdateAsync
            _repositoryMock.Verify(r => r.UpdateAsync(order), Times.Once);

            // Verificamos que el estado haya cambiado correctamente
            Assert.Equal(OrderStatus.CashVerified, order.Status);
        }

        // 4️⃣ Verifica que se registren logs (opcional pero útil)
        [Fact(DisplayName = " Debe registrar mensajes de log durante la verificación de efectivo")]
        public async Task CheckCashHandleAsync_ShouldLogMessages()
        {
            var command = new CheckCashOrderCommand(7);

            var order = new Domain.Entities.LogisticOrder(10, 20)
            {
                Status = OrderStatus.PendingCashVerification,
                PaymentType = PaymentType.Cash
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(7))
                           .ReturnsAsync(order);

            await _handler.CheckCashHandleAsync(command);

            // Verificar que se haya cambiado el estado
            Assert.Equal(OrderStatus.CashVerified, order.Status);
        }
    }
}
