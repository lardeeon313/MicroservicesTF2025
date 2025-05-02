using SalesService.Application.Queries.Customer;
using SalesService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SalesService.Application
{
    public interface IGetCustomerByIdHandler
    {

     Task <Customer> Handle (GetCustomerByIdQuery query);

    }
}
