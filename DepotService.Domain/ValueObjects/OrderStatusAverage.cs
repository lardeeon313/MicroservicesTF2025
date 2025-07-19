using DepotService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.ValueObjects
{
    public class OrderStatusAverage
    {
        public OrderStatus Status { get; set; }
        public double AverageDuration { get; set; }
    }
}
