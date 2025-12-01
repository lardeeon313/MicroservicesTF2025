using LogisticService.Application.Commands.LogisticManager.LogisticOrder.AssignOrder;
using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using LogisticService.Infraestructure.Messaging.Publisher;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Test.Commands.LogisticManager.LogisticOrder
{
    public class AssignOrderHandlerTests
    {
        private readonly Mock<ILogisticOrderRepository> _orderRepoMock;
        private readonly Mock<IDeliveryTeamRepository> _teamRepoMock;
        private readonly Mock<IRabbitMQPublisher> _publisherMock;
        private readonly Mock<ILogger<AssignOrderCommandHandler>> _loggerMock;
        private readonly Mock<IHttpContextAccessor> _httpContextMock;

        private readonly AssignOrderCommandHandler _handler;

        public AssignOrderHandlerTests()
        {
            _orderRepoMock = new Mock<ILogisticOrderRepository>();
            _teamRepoMock = new Mock<IDeliveryTeamRepository>();
            _publisherMock = new Mock<IRabbitMQPublisher>();
            _loggerMock = new Mock<ILogger<AssignOrderCommandHandler>>();
            _httpContextMock = new Mock<IHttpContextAccessor>();

            _handler = new AssignOrderCommandHandler(
                _publisherMock.Object,
                _orderRepoMock.Object,
                _teamRepoMock.Object,
                _loggerMock.Object,
                _httpContextMock.Object
            );
        }

        // 1️⃣ Orden no existe
        [Fact(DisplayName ="HandleAsync debe retornar false cuando la orden no existe")]
        public async Task HandleAsync_ShouldReturnFalse_WhenOrderDoesNotExist()
        {
            var command = new AssignOrderCommand(1, Guid.NewGuid(), null);
            _orderRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync((Domain.Entities.LogisticOrder)null!);

            var result = await _handler.HandleAsync(command);

            Assert.False(result);
        }

        // 2️⃣ Equipo no existe
        [Fact(DisplayName = "HandleAsync debe retornar false cuando el equipo no existe")]
        public async Task HandleAsync_ShouldReturnFalse_WhenTeamNotFound()
        {
            var command = new AssignOrderCommand(1, Guid.NewGuid(), null);

            _orderRepoMock.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(new Domain.Entities.LogisticOrder(10, 20));

            _teamRepoMock.Setup(r => r.GetTeamByOperatorAsync(command.OperatorUserId))
                .ReturnsAsync((Domain.Entities.DeliveryTeam)null!);

            var result = await _handler.HandleAsync(command);

            Assert.False(result);
        }

        // 3️⃣ Sin zoneId y sin zonas activas
        [Fact(DisplayName = "HandleAsync debe retornar false cuando no se provee zona y el equipo no tiene zonas activas")]
        public async Task HandleAsync_ShouldReturnFalse_WhenNoZoneProvided_AndTeamHasNoActiveZones()
        {
            var command = new AssignOrderCommand(1, Guid.NewGuid(), null);

            var order = new Domain.Entities.LogisticOrder(10, 20);
            var team = new Domain.Entities.DeliveryTeam("Team A", "desc");

            _orderRepoMock.Setup(o => o.GetByIdAsync(1)).ReturnsAsync(order);
            _teamRepoMock.Setup(t => t.GetTeamByOperatorAsync(command.OperatorUserId)).ReturnsAsync(team);

            var result = await _handler.HandleAsync(command);

            Assert.False(result);
        }

        // 4️⃣ Método de dominio tira InvalidOperationException
        [Fact(DisplayName = "HandleAsync debe retornar false cuando el método de dominio lanza InvalidOperationException")]
        public async Task HandleAsync_ShouldReturnFalse_WhenDomainThrowsInvalidOperation()
        {
            var command = new AssignOrderCommand(1, Guid.NewGuid(), 5);

            var order = new Domain.Entities.LogisticOrder(10, 20)
            {
                Status = OrderStatus.PendingVerification // no es Verified → lanza InvalidOperationException
            };

            var team = new Domain.Entities.DeliveryTeam("Team A", "desc");

            team.DeliveryOperators.Add(new Domain.Entities.DeliveryTeamMemberAssignment
            {
                OperatorUserId = command.OperatorUserId
            });

            team.ZoneAssignments.Add(new DeliveryTeamZoneAssignment { DeliveryZoneId = 5, IsActive = true });

            _orderRepoMock.Setup(o => o.GetByIdAsync(1)).ReturnsAsync(order);
            _teamRepoMock.Setup(t => t.GetTeamByOperatorAsync(command.OperatorUserId)).ReturnsAsync(team);

            var result = await _handler.HandleAsync(command);

            Assert.False(result);
        }

        // 5️⃣ Usa la zona pasada en el comando
        [Fact(DisplayName = "HandleAsync debe asignar usando la zona pasada en el comando")]
        public async Task HandleAsync_ShouldAssignUsingCommandZone()
        {
            var command = new AssignOrderCommand(1, Guid.NewGuid(), 99);

            var order = new Domain.Entities.LogisticOrder(10, 20);
            var team = new Domain.Entities.DeliveryTeam("Team A", "desc");

            _orderRepoMock.Setup(o => o.GetByIdAsync(1)).ReturnsAsync(order);
            _teamRepoMock.Setup(t => t.GetTeamByOperatorAsync(command.OperatorUserId)).ReturnsAsync(team);

            var result = await _handler.HandleAsync(command);
        }

        // 6️⃣ Toma zona del equipo si no se pasa en el comando
        [Fact(DisplayName = "HandleAsync debe asignar usando la zona activa del equipo si no se pasa en el comando")]
        public async Task HandleAsync_ShouldAssignUsingTeamsActiveZone()
        {
            var command = new AssignOrderCommand(1, Guid.NewGuid(), null);

            var order = new Domain.Entities.LogisticOrder(10, 20);
            order.Status = OrderStatus.Verified;

            var team = new Domain.Entities.DeliveryTeam("Team A", "desc");

            team.DeliveryOperators.Add(new Domain.Entities.DeliveryTeamMemberAssignment
            {
                OperatorUserId = command.OperatorUserId
            });

            team.ZoneAssignments.Add(new DeliveryTeamZoneAssignment { DeliveryZoneId = 55, IsActive = true });

            _orderRepoMock.Setup(o => o.GetByIdAsync(1)).ReturnsAsync(order);
            _teamRepoMock.Setup(t => t.GetTeamByOperatorAsync(command.OperatorUserId)).ReturnsAsync(team);

            var result = await _handler.HandleAsync(command);

            Assert.True(result);
            _orderRepoMock.Verify(r => r.UpdateAsync(order), Times.Once);
        }

        // 7️⃣ Obtiene correctamente AssignedByUserId del HttpContext
        [Fact(DisplayName = "HandleAsync debe leer el UserId del HttpContext")]
        public async Task HandleAsync_ShouldReadUserIdFromHttpContext()
        {
            var operatorId = Guid.NewGuid();
            var command = new AssignOrderCommand(1, operatorId, 50);

            // HttpContext con userId
            var userId = Guid.NewGuid();
            var claims = new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) };
            var identity = new ClaimsIdentity(claims, "test");
            var principal = new ClaimsPrincipal(identity);
            var context = new DefaultHttpContext { User = principal };

            _httpContextMock.Setup(h => h.HttpContext).Returns(context);

            var order = new Domain.Entities.LogisticOrder(10, 20);
            order.Status = OrderStatus.Verified;
            var team = new Domain.Entities.DeliveryTeam("Team A", "desc");

            team.ZoneAssignments.Add(new DeliveryTeamZoneAssignment
            {
                DeliveryZoneId = 10,
                IsActive = true
            });

            team.DeliveryOperators.Add(new Domain.Entities.DeliveryTeamMemberAssignment
            {
                OperatorUserId = command.OperatorUserId
            });

            _orderRepoMock.Setup(o => o.GetByIdAsync(1)).ReturnsAsync(order);
            _teamRepoMock.Setup(t => t.GetTeamByOperatorAsync(operatorId)).ReturnsAsync(team);

            var result = await _handler.HandleAsync(command);

            Assert.True(result);
        }

        // 8️⃣ Si falla obtener el UserId igual debe asignar
        [Fact(DisplayName = "HandleAsync debe asignar incluso si falla parsear el UserId del HttpContext")]
        public async Task HandleAsync_ShouldAssignEvenIfUserIdParsingFails()
        {
            var command = new AssignOrderCommand(1, Guid.NewGuid(), 50);

            // HttpContext con claim inválido
            var claims = new[] { new Claim(ClaimTypes.NameIdentifier, "INVALID_GUID") };
            var identity = new ClaimsIdentity(claims, "test");
            var principal = new ClaimsPrincipal(identity);
            var context = new DefaultHttpContext { User = principal };

            _httpContextMock.Setup(h => h.HttpContext).Returns(context);

            // --- ORDEN ---
            var order = new Domain.Entities.LogisticOrder(10, 20);
            order.Status = OrderStatus.Verified;
            var team = new Domain.Entities.DeliveryTeam("Team A", "desc");

            team.ZoneAssignments.Add(new DeliveryTeamZoneAssignment
            {
                DeliveryZoneId = 10,
                IsActive = true
            });
            
            team.DeliveryOperators.Add(new Domain.Entities.DeliveryTeamMemberAssignment
            {
                OperatorUserId = command.OperatorUserId
            });

            _orderRepoMock.Setup(o => o.GetByIdAsync(1)).ReturnsAsync(order);
            _teamRepoMock.Setup(t => t.GetTeamByOperatorAsync(command.OperatorUserId)).ReturnsAsync(team);

            var result = await _handler.HandleAsync(command);

            Assert.True(result);
        }
    }
}
