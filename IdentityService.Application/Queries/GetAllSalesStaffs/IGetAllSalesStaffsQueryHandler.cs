using IdentityService.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Queries.GetAllSalesStaffs
{
    /// <summary>
    /// Interfaz para el manejador de la consulta GetAllSalesStaffQuery.
    /// </summary>
    public interface IGetAllSalesStaffsQueryHandler
    {
        Task<IEnumerable<SalesStaffDto>> HandleAsync();
    }
}
