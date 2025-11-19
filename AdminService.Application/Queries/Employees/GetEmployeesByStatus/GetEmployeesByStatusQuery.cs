using AdminService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Queries.Employees.GetEmployeesByStatus
{
    public class GetEmployeesByStatusQuery
    {
        public EmployeeStatus Status { get; set; }

        public GetEmployeesByStatusQuery(EmployeeStatus status)
        {
            Status = status;
        }
    }
}
