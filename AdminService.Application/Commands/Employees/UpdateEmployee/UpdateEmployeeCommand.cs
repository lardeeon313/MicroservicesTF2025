using AdminService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Commands.Employees.UpdateEmployee
{
    public class UpdateEmployeeCommand
    {
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;        
        public string PhoneNumber { get; set; } = null!;
        public string Email { get; set; } = null!;
        public EmployeeRole Role { get; set; }
        public EmployeeStatus Status { get; set; }
        public EmployeeSector Sector { get; set; }

        public UpdateEmployeeCommand(int id, string userName, string firstName, string lastName, string phoneNumber, string email, EmployeeRole role, EmployeeStatus status, EmployeeSector sector)
        {
            Id = id;
            UserName = userName;
            FirstName = firstName;
            LastName = lastName;            
            PhoneNumber = phoneNumber;
            Email = email;
            Role = role;
            Status = status;
            Sector = sector;
        }
    }
}
