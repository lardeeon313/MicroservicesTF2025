using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DepotService.Domain.Entities.Operator;
using DepotService.Domain.Enums.DepotTeam;

namespace DepotService.Domain.IRepositories.IDepotTeam
{
    public interface IDepotTeam
    {
        //Devuelve todos los operadores de un equipo especifico (Si es norte , sur o centro)
        Task<List<Operator>> GetOperatorsByTeamAsync(DepotTeam team);

        //agrega a un operador a un equipo especifico 
        Task AddOperatorToTeamAsync(Guid OperatorID, DepotTeam team);

        //Quita a un operador de un equipo especifico 
        Task RemoveOperatorFromTeamAsync(Guid OperatorID, DepotTeam team);
        //Verifica si un operador pertence a un equipo 
        Task<bool> IsOperatorInTeamAsync (Guid OperatorID, DepotTeam team);

        //Devuelve todos los equipos con sus operadores 
        Task<Dictionary<DepotTeam, List<Operator>>> GetAllTeamAsync();
    }
}
