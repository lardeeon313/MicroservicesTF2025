using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetPendingCashVerificationReport
{
    public class GetPendingCashVerificationReportQuery
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Guid? OperatorId { get; set; }
        public int? DeliveryTeamId { get; set; }
    }
}
