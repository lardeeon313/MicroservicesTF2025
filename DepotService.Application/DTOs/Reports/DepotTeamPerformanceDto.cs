using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.Reports
{
    public class DepotTeamPerformanceDto
    {
        public int? DepotTeamId { get; set; }        // Equipo (si aplica)
        public string Name { get; set; } = null!;    // Equipo u Operario

        public int OrdersHandled { get; set; }
        public int MissingItemsReported { get; set; }

        public bool IsTeam { get; set; }             // True = fila de equipo
        public Guid? OperatorId { get; set; }        // Si es operador
    }
}
