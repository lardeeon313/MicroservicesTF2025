using SalesService.Application.DTOs.Customer;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Customers.GetPagedCustomers
{
    public class GetPagedCustomersQueryHandler(ICustomerRepository repository) : IGetPagedCustomersQueryHandler
    {
        private readonly ICustomerRepository _repository = repository;

        public async Task<PagedCustomerResponse> HandleAsync(GetPagedCustomersQuery query, CancellationToken cancellationToken)
        {
            var (customers, totalCount) = await _repository.GetPagedAsync(query.PageNumber, query.PageSize, cancellationToken);
            var totalPages = (int)Math.Ceiling((double)totalCount / query.PageSize);

            return new PagedCustomerResponse
            {
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling((double)totalCount / query.PageSize),
                CurrentPage = query.PageNumber,
                Customers = customers.Select(c => new CustomerResponse
                {
                    Id = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Email = c.Email,
                    PhoneNumber = c.PhoneNumber,
                    Address = c.Address,
                    Status = c.Status.ToString()
                }).ToList()
            };
        }
    }
}
