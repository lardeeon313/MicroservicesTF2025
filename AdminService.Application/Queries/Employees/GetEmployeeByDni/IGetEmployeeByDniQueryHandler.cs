using AdminService.Application.DTOs.Employee;
using AdminService.Application.Queries.Employee.GetEmployeeByDni;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Queries.Employees.GetEmployeeByDni
{
    public interface IGetEmployeeByDniQueryHandler
    {
        Task<EmployeeDto> GetEmployeeByDniAsync(GetEmployeeByDniQuery query);
    }
}
