using AdminService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Domain.Entities
{
    public class Employee
    {
        public int Id { get; set; }
        public string? IdentityUserId { get; set; }

        [MaxLength(450)]
        [Required]
        public string UserName { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = null!;

        [MaxLength(30)]
        public string? PhoneNumber { get; set; } 

        [Required]  
        [MaxLength(100)]
        public string Email { get; set; } = null!;

        public EmployeeRole Role { get; set; }
        public EmployeeStatus Status { get; set; }
        public EmployeeSector Sector { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public Employee()
        {            
        }

        public Employee(
            string userName,
            string firstName,
            string lastName,            
            string email,
            string phoneNumber,
            EmployeeRole role,
            EmployeeStatus status,
            EmployeeSector sector,
            DateTime createdAt)
        {
            UserName = userName;
            FirstName = firstName;
            LastName = lastName;            
            Email = email;
            PhoneNumber = phoneNumber;
            Role = role;
            Status = status;
            Sector = sector;
            CreatedAt = createdAt;
        }

    }
}
