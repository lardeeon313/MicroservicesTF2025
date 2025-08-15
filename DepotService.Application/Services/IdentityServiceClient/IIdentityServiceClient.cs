using DepotService.Application.DTOs.DepotManager;
using DepotService.Application.DTOs.DepotOperator;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Services.IdentityServiceClient
{
    public interface IIdentityServiceClient
    {
        Task<List<DepotOperatorsDto>> GetUserWithRoleOperator();
    }
}
