using AdminService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Queries.Employees.GetEmployeesBySector
{
    public class GetEmployeesBySectorQuery
    {
        public EmployeeSector Sector { get; set; }
        public GetEmployeesBySectorQuery(EmployeeSector sector)
        {
            Sector = sector;
        }
    }
}
