using IdentityService.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Queries.GetAllDeliverys
{
    public interface IGetAllDeliverysQueryHandler
    {
        Task<IEnumerable<DeliveryOperatorDto>> HandleAsync();
    }
}
