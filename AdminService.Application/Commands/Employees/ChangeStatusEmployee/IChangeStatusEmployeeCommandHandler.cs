using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Commands.Employees.ChangeStatusEmployee
{
    public interface IChangeStatusEmployeeCommandHandler
    {
        Task<bool> ChangeStatusEmployeeAsync(ChangeStatusEmployeeCommand command);
    }
}
