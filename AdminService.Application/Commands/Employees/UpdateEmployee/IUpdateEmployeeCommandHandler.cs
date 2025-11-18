using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Commands.Employees.UpdateEmployee
{
    public interface IUpdateEmployeeCommandHandler
    {
        Task<bool> UpdateEmployeeAsync(UpdateEmployeeCommand command);
    }
}
