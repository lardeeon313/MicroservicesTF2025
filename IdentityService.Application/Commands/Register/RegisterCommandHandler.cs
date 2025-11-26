using IdentityService.Application.Common;
using IdentityService.Application.Interfaces;
using IdentityService.Domain.Entities;
using IdentityService.Domain.Enums;
using IdentityService.Infraestructure.Messaging.Publisher;
using Microsoft.AspNetCore.Identity;
using SharedKernel.IntegrationEvents.IdentityEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Commands.Register
{
    public class RegisterCommandHandler(
        UserManager<ApplicationUser> userManager, 
        RoleManager<IdentityRole> roleManager,
        IRabbitMQPublisher rabbitMQPublisher) 
        : IRegisterCommandHandler
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly RoleManager<IdentityRole> _roleManager = roleManager;
        private readonly IRabbitMQPublisher _rabbitPublisher = rabbitMQPublisher;

        public async Task<CommandResult> Handle(RegisterCommand command)
        {
            var existingUser = await _userManager.FindByEmailAsync(command.Email);
            if (existingUser != null)
                return new CommandResult { Success = true , Message = "User it exists"};

            var user = new ApplicationUser
            {
                UserName = command.UserName,
                Name = command.Name,
                LastName = command.LastName,
                Email = command.Email,
                PhoneNumber = command.PhoneNumber,
                HightDate = DateTime.UtcNow,
                Employed_Status = EmployedStatus.Inactive
            };

            var result = await _userManager.CreateAsync(user, command.Password);
            if (!result.Succeeded)
            {
                var errorMessages = string.Join(" ", result.Errors.Select(e => e.Description));
                return new CommandResult { Success = false, Message = $"Error al crear el usuario: {errorMessages}" };
            }
            
            var selectedRole = command.Role;
            var validRoles = new[]
            {
                "DepotManager", "DepotOperator", "BillingManager", "SalesStaff", "DeliveryOperator", "VerificationManager", "Admin"
            };

            if (!validRoles.Contains(selectedRole))
            {
                return new CommandResult { Success = false, Message = $"Rol inválido: {selectedRole}" };
            }

            if (!await _roleManager.RoleExistsAsync(selectedRole))
                await _roleManager.CreateAsync(new IdentityRole(selectedRole));

            await _userManager.AddToRoleAsync(user, selectedRole);

            // Publicar evento a AdminService
            var integrationEvent = new UserRegisteredIntegrationEvent
            {
                UserIdentityId = user.Id,
                UserName = user.UserName,
                FirstName = user.Name,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = selectedRole
            };

            await _rabbitPublisher.PublishAsync(integrationEvent, "identity_user_registered_queue");

            return new CommandResult { Success = true, Message = "Usuario registrado exitosamente con rol Seleccionado." };

            /*
            //Asigna un rol neutro por ahora...
            const string defaultRole = "Default";

            if (!await _roleManager.RoleExistsAsync(defaultRole))
                await _roleManager.CreateAsync(new IdentityRole(defaultRole));

            await _userManager.AddToRoleAsync(user, defaultRole);

            return new CommandResult { Success = true, Message = "Usuario registrado exitosamente con rol default." };
            */
        }
    }
}
