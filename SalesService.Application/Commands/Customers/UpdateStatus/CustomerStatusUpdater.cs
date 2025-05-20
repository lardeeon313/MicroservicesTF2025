using SalesService.Application.Utils;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Customers.UpdateStatus
{
    public class CustomerStatusUpdater(ICustomerRepository customerRepository, IOrderRepository orderRepository)
    {
        public async Task UpdateStatusesAsync()
        {
            var allCustomers = await customerRepository.GetAllAsync();

            foreach (var customer in allCustomers)
            {
                var lastOrderDate = await orderRepository.GetLastOrderDateByCustomerId(customer.Id);

                if (lastOrderDate is null)
                    continue;

                var newStatus = CustomerStatusEvaluator.GetStatusBasedOn(lastOrderDate.Value);

                if (customer.Status != newStatus)
                {
                    customer.Status = newStatus;
                    await customerRepository.UpdateAsync(customer);
                }
            }
        }
    }

}
