using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DepotService.Domain.Entities.Operator;

namespace DepotService.Domain.IRepositories.IOrderTeam
{
    public interface IOrderTeam
    {
        // Asigna operadores a una orden específica (el equipo ya debe estar determinado por IDepotTeam)
        Task AssignOperatorsToOrderAsync(int OrderId, List<Operator> operators);
        //devuelve todos los operadores que esten asignados a tal order 
        Task<List<Operator>> GetOperatorsByOrderAsync(int OrderId);

        //elimina a todos los operadores que esten asignados a una order: 
        Task RemoveOperatorsFromOrderAsync (int OrderId);

    }
}
