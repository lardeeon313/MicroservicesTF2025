using AdminService.Application.DTOs.Employee;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Queries.Employees.GetEmployeeById
{
    public interface IGetEmployeeByIdQueryHandler
    {
        Task<EmployeeDto> GetEmployeeById(GetEmployeeByIdQuery query);
    }
}
