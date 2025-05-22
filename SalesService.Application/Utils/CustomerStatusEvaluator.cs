using SalesService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Utils
{
    public static class CustomerStatusEvaluator
    {
        public static CustomerStatus GetStatusBasedOn(DateTime lastOrderDate)
        {
            var now = DateTime.UtcNow;
            var weeksDifference = (now - lastOrderDate).TotalDays / 7;

            if (weeksDifference <= 1)
                return CustomerStatus.Active;

            if (weeksDifference <= 8) // menos de 2 meses
                return CustomerStatus.Inactive;

            return CustomerStatus.Lost;
        }
    }
}
