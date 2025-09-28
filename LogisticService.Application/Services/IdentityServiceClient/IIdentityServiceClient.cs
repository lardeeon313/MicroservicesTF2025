using LogisticService.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Services.IdentityServiceClient
{
    public interface IIdentityServiceClient
    {
        Task<List<DeliveryOperatorDto>> GetUserWithRoleDeliveryOperator();
    }
}
