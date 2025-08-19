using IdentityService.Application.DTOs;
using IdentityService.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Queries.GetCurrentUser
{
    public class GetCurrentUserQueryHandler(UserManager<ApplicationUser> userManager) : IGetCurrentUserQueryHandler
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        public async Task<UserDto> GetCurrentUserHandler(GetCurrentUserQuery query)
        {
            var user = await _userManager.FindByIdAsync(query.UserId);

            if (user == null)
                throw new KeyNotFoundException("Usuario no encontrado");

            // Obtener roles del usuario
            var roles = await _userManager.GetRolesAsync(user);

            return new UserDto
            {
                Id = user.Id,
                FirstName = user.Name,
                LastName = user.LastName,
                Email = user.Email,
                Roles = roles.ToList(),
                EmployedStatus = user.Employed_Status,
                HightDate = user.HightDate,
                Validity = user.Validity
            };

        }
    }
}
