using LogisticService.Application.DTOs.LogisticReportDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetDeliveryTimeReport
{
    public interface IGetDeliveryTimeReportQueryHandler
    {
        Task<List<DeliveryTimeReportDto>> GetDeliveryTimeReportAsync(GetDeliveryTimeReportQuery query);
    }
}
