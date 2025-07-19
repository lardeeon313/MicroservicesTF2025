using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SalesService.Application.DTOs.Order;
using SalesService.Domain.Common.Interfaces;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure;
using SalesService.Infraestructure.Email.EmailTemplates;
using SalesService.Infraestructure.Messaging.Publisher;
using SharedKernel.IntegrationEvents.SalesEvents.DTOs;
using SharedKernel.IntegrationEvents.SalesEvents.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.OrderReissued
{
    public class OrderReissuedCommandHandler(IEmailService emailService,IRabbitMQPublisher publisher, IOrderRepository repository, SalesDbContext context) : IOrderReissuedCommandHandler
    {
        private readonly IOrderRepository _repository = repository;
        private readonly SalesDbContext _context = context;
        private readonly IRabbitMQPublisher _publisher = publisher;
        private readonly IEmailService _emailService = emailService;

        /// <summary>
        /// handler para el comando OrderReissuedCommand.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public async Task<bool> HandleOrderReissuedAsync(OrderReissuedCommand command)
        {
            var orderExists = await _repository.GetByIdAsync(command.SalesOrderId);
            if (orderExists == null)
            {
                throw new Exception($"Order with ID {command.SalesOrderId} does not exist.");
            }

            var orderMissing = await _context.OrderMissings
                .FirstOrDefaultAsync(o => o.OrderId == command.SalesOrderId);

            if (orderMissing == null)
                throw new Exception($"Order with ID {command.SalesOrderId} does not have a missing report.");

            orderMissing.MissingDescription = command.DescriptionResolution;

            orderExists.Items = command.UpdateItems.Select(i => new OrderItem
            {
                Id = i.Id,
                ProductName = i.ProductName,
                ProductBrand = i.ProductBrand,
                Quantity = i.Quantity
            }).ToList();

            if (orderExists.Status == OrderStatus.ReIssued)
            {
                // Creamos el evento Reissued
                var integrationEvent = new OrderReissuedIntegrationEvent
                {
                    SalesOrderId = command.SalesOrderId,
                    ResolutionDescription = command.DescriptionResolution,
                    ReissuedAt = DateTime.UtcNow,
                    DeliveryDate = orderExists.DeliveryDate,
                    UpdateItems = command.UpdateItems.Select(i => new OrderItemsDto
                    {
                        Id = i.Id,
                        ProductName = i.ProductName,
                        ProductBrand = i.ProductBrand,
                        Quantity = i.Quantity
                    }).ToList()
                };

                await _publisher.PublishAsync(integrationEvent, "order_reissued_queue");

                var htmlBody = EmailTemplateGenerator.BuildReissuedOrderTemplate(
                    customerName: orderExists.Customer.FirstName + " " + orderExists.Customer.LastName,
                    salesOrderId: orderExists.Id,
                    resolution: command.DescriptionResolution,
                    items: command.UpdateItems.Select(i => new OrderItemsDto
                    {
                        Id = i.Id,
                        ProductName = i.ProductName,
                        ProductBrand = i.ProductBrand,
                        Quantity = i.Quantity
                    }).ToList()
                );

                await _emailService.SendEmailAsync(
                
                    orderExists.Customer.Email,
                    "Tu pedido fue reemitido - Verona",
                     htmlBody
                );

                return true;

            }
            return false;
        }
    }
}
