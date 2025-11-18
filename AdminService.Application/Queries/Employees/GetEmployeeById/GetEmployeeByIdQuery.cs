using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Queries.Employees.GetEmployeeById
{
    public class GetEmployeeByIdQuery
    {
        public int EmployeeId { get; set; }

        public GetEmployeeByIdQuery(int employeeId)
        {
            EmployeeId = employeeId;
        }
    }
}
