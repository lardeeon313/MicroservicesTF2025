using AdminService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Commands.Employees.ChangeStatusEmployee
{
    public class ChangeStatusEmployeeCommand
    {
        public int EmployeeId { get; set; }
        public EmployeeStatus Status { get; set; }

        public ChangeStatusEmployeeCommand(int employeeId, EmployeeStatus status)
        {
            EmployeeId = employeeId;
            Status = status;
        }
    }
}
