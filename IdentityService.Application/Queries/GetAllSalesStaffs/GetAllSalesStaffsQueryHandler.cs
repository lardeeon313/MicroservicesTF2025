using IdentityService.Application.DTOs;
using IdentityService.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace IdentityService.Application.Queries.GetAllSalesStaffs
{
    public class GetAllSalesStaffsQueryHandler(UserManager<ApplicationUser> userManager) : IGetAllSalesStaffsQueryHandler
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        public async Task<IEnumerable<SalesStaffDto>> HandleAsync()
        {
            var salesstaffs = await _userManager.GetUsersInRoleAsync("SalesStaff");

            if (salesstaffs == null)
                throw new InvalidOperationException($"User with role SalesStaff not found.");


            return salesstaffs.Select(o => new SalesStaffDto
            {
                Id = o.Id,
                FirstName = o.Name,
                LastName = o.LastName
            }).ToList();
        }
    }
}
