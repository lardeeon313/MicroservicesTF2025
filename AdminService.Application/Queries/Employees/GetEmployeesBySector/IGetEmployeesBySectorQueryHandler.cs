using AdminService.Application.DTOs.Employee;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Queries.Employees.GetEmployeesBySector
{
    public interface IGetEmployeesBySectorQueryHandler
    {
        Task<IEnumerable<EmployeeDto>> GetEmployeesBySectorAsync(GetEmployeesBySectorQuery query);
    }
}
