using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Queries.Employees.GetEmployeesByStatus
{
    public class GetEmployeesByStatusQuery
    {
        public int Status { get; set; }

        public GetEmployeesByStatusQuery(int status)
        {
            Status = status;
        }
    }
}
