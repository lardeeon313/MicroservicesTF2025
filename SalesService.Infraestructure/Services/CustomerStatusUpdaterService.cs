using System.Threading;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Persistence.Repositories;
using System;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Infraestructure.Services
{
    public class CustomerStatusUpdaterService : BackgroundService
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly ILogger<CustomerStatusUpdaterService> _logger;
        private readonly TimeSpan _delay = TimeSpan.FromHours(24); // Ejecuta cada 24hs

        public CustomerStatusUpdaterService(
            ICustomerRepository customerRepository,
            IOrderRepository orderRepository,
            ILogger<CustomerStatusUpdaterService> logger)
        {
            _customerRepository = customerRepository;
            _orderRepository = orderRepository;
            _logger = logger;
        }


        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Starting customer status update...");

                try
                {
                    var customers = await _customerRepository.GetAllAsync();

                    foreach (var customer in customers)
                    {
                        var lastOrderDate = await _orderRepository.GetLastOrderDateByCustomerId(customer.Id);

                        if (lastOrderDate is null)
                            continue;

                        var newStatus = GetStatusBasedOn(lastOrderDate);

                        if (customer.Status != newStatus)
                        {
                            customer.Status = newStatus;
                            await _customerRepository.UpdateAsync(customer);
                            string message = $"Updated customer {customer.Email} status to {newStatus}.";
                            _logger.LogInformation(message);
                        }
                    }

                } catch (Exception ex)
                {
                    _logger.LogError(ex, "Error updating customer statuses");
                }        

                await Task.Delay(_delay, stoppingToken); // Espera hasta la proxima ejecucion

            }

        }


        private static CustomerStatus GetStatusBasedOn(DateTime? lastOrderDate)
        {
            if (!lastOrderDate.HasValue)
                return CustomerStatus.Inactive;

            var now = DateTime.UtcNow;
            var diff = now - lastOrderDate.Value;

            if (diff.TotalDays <= 7)
                return CustomerStatus.Active;

            if (diff.TotalDays > 90)
                return CustomerStatus.Lost;

            return CustomerStatus.Inactive;
        }
    }
}
