using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Queries.Employee.GetEmployeeByDni
{
    public class GetEmployeeByDniQuery
    {
        public string Dni { get; set; } = null!;

        public GetEmployeeByDniQuery(string dni)
        {
            Dni = dni;
        }
    }
}
