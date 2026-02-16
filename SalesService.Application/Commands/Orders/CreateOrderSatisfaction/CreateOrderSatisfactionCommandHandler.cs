using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.CreateOrderSatisfaction
{
    public class CreateOrderSatisfactionCommandHandler(IOrderRepository repository) : ICreateOrderSatisfactionCommandHandler
    {
        private readonly IOrderRepository _repository = repository;

        /// <summary>
        /// Handler para crear una satisfaccion de pedido
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> Handle(CreateOrderSatisfactionCommand command)
        {
            var orderSatisfactionToken =
                await _repository.GetOrderSatisfactionByTokenAsync(command.Token);

            if (orderSatisfactionToken == null)
                throw new InvalidOperationException("Invalid satisfaction token.");

            orderSatisfactionToken.Validate();

            var order = orderSatisfactionToken.Order;

            if (order == null)
                throw new InvalidOperationException("Order not found.");

            if (order.Status != OrderStatus.Delivered)
                throw new InvalidOperationException("Order is not delivered.");

            var alreadyRated = await _repository
                .OrderHasSatisfactionAsync(order.Id);

            if (alreadyRated)
                throw new InvalidOperationException("Order already rated.");

            Console.WriteLine("➡️ Creando OrderSatisfaction...");

            var satisfaction = new OrderSatisfaction(
                order.Id,
                order.CustomerId,
                command.Score,
                command.Comment
            );

            await _repository.AddOrderSatisfactionAsync(satisfaction);

            orderSatisfactionToken.MarkAsUsed();

            await _repository.SaveChangesAsync();

            Console.WriteLine("💾 SaveChanges ejecutado correctamente.");

            return true;
        }
    }
}