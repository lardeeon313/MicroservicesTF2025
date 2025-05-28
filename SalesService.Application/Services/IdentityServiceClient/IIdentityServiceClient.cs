using SalesService.Application.DTOs.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Infraestructure.Services
{
    public interface IIdentityServiceClient
    {
        Task<List<SalesStaffDto>> GetSalesStaffsAsync();
    }
}
