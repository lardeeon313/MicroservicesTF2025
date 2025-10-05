using IdentityService.Application.DTOs;
using IdentityService.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Queries.GetAllDeliverys
{
    public class GetAllDeliverysQueryHandler(UserManager<ApplicationUser> userManager) : IGetAllDeliverysQueryHandler
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        public async Task<IEnumerable<DeliveryOperatorDto>> HandleAsync()
        {
            var deliveryOperators = await _userManager.GetUsersInRoleAsync("DeliveryOperator");

            return deliveryOperators.Select(o => new DeliveryOperatorDto
            {
                Id = o.Id,
                FirstName = o.Name,
                LastName = o.LastName,
                PhoneNumber = o.PhoneNumber,
                Email = o.Email
            }).ToList();
        }
    }
}
