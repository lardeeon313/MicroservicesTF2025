using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetDepotTeamPerformance
{
    /// <summary>
    /// Query para obtener el rendimiento del equipo del depósito.
    /// </summary>
    public class GetDepotTeamPerformanceQuery
    {
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public bool AgruparPorEquipo { get; set; }
 

        public GetDepotTeamPerformanceQuery(DateTime? from, DateTime? to,
                                            bool agruparPorEquipo)
        {
            From = from;
            To = to;
            AgruparPorEquipo = agruparPorEquipo;            
        }
    }

}
