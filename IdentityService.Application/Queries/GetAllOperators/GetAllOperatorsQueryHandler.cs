using IdentityService.Application.DTOs;
using IdentityService.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Queries.GetAllOperators
{
    public class GetAllOperatorsQueryHandler(UserManager<ApplicationUser> userManager) : IGetAllOperatorsQueryHandler
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        public async Task<IEnumerable<OperatorDto>> HandleAsync()
        {
            var operators = await _userManager.GetUsersInRoleAsync("DepotOperator");

            return operators.Select(o => new OperatorDto
            {
                Id = o.Id,
                FullName = $"{o.Name} {o.LastName}",
                Email = o.Email
            }).ToList();
        }
    }
}
