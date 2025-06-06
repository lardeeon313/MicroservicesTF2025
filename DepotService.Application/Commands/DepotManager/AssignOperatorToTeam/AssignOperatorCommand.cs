using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.AssignOperator
{
    /// <summary>
    /// Comando para asignar un operario a un equipo 
    /// </summary>
    public class AssignOperatorCommand
    {
        /// <summary>
        /// Identificador del operario a asignar.
        /// </summary>
        public Guid OperatorUserId { get; set; }

        /// <summary>
        /// Identificador del equipo al que se asigna el operario.
        /// </summary>
        public int TeamId { get; set; }

        /// <summary>
        /// Constructor para crear un comando de asignación de operario.
        /// </summary>
        /// <param name="operatorId">Identificador del operario.</param>
        /// <param name="teamId">Identificador del equipo.</param>
        public AssignOperatorCommand(Guid operatorUserId, int teamId)
        {
            OperatorUserId = operatorUserId;
            TeamId = teamId;
        }
    }
}
