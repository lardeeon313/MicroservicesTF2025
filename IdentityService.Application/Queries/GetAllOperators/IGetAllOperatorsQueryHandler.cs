using IdentityService.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Queries.GetAllOperators
{
    /// <summary>
    /// Interfaz para el manejador de la consulta GetAllOperatorsQuery.
    /// </summary>
    public interface IGetAllOperatorsQueryHandler
    {
        Task <IEnumerable<OperatorDto>> HandleAsync();
    }
}
