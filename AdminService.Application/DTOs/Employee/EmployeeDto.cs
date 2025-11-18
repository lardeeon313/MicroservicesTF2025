using AdminService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.DTOs.Employee
{
    public class EmployeeDto
    {
        public int? Id { get; set; } 
        public string? UserName { get; set; } 
        public string? FirstName { get; set; } 
        public string? LastName { get; set; } 
        public string? Dni { get; set; } 
        public string? PhoneNumber { get; set; } 
        public string? Email { get; set; } 
        public EmployeeRole Role { get; set; }
        public EmployeeStatus Status { get; set; }
        public EmployeeSector Sector { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
