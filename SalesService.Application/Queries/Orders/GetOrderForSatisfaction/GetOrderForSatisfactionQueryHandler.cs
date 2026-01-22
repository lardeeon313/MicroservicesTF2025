using SalesService.Application.DTOs.Order;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetOrderForSatisfaction
{
    public class GetOrderForSatisfactionQueryHandler(IOrderRepository orderRepository, ICustomerRepository customerRepository) : IGetOrderForSatisfactionQueryHandler
    {
        private readonly IOrderRepository _repository = orderRepository;
        private readonly ICustomerRepository _customerRepository = customerRepository;

        /// <summary>
        /// Query para obtener un pedido para satisfaccion
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        public async Task<OrderForSatisfactionDto?> Handle(GetOrderForSatisfactionQuery query)
        {
            var orderSatisfaction = await _repository.GetOrderSatisfactionByTokenAsync(query.Token);

            if (orderSatisfaction == null)
                return null;

            orderSatisfaction.Validate();
            
            var customer = await _customerRepository.GetByIdAsync(orderSatisfaction.Order.CustomerId);            

            return new OrderForSatisfactionDto
            {
                OrderId = orderSatisfaction.Order.Id,
                OrderDate = orderSatisfaction.Order.OrderDate,
                CustomerName = customer != null ? $"{customer.FirstName} {customer.LastName}" : "Unknown Customer",
                Items = orderSatisfaction.Order.Items.Select(i => new OrderItemForSatisfactionDto
                {
                    ProductBrand = i.ProductBrand!,
                    ProductName = i.ProductName!,
                    Quantity = i.Quantity
                }).ToList(),
                DeliveryDate = orderSatisfaction.Order.DeliveryDate,
                DeliveryDetail = orderSatisfaction.Order.DeliveryAddress != null ?
                    $"{orderSatisfaction.Order.DeliveryAddress.Street}, {orderSatisfaction.Order.DeliveryAddress.City}" : null,
                AlreadyRated = orderSatisfaction.Order.Satisfaction != null
            };
        }
    }
}
