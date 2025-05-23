using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.Entities.Notification
{
    public class Notification
    {
        public Guid IdNotificaction { get; set; } = Guid.NewGuid();
        public DateTime MissingDate { get; set; } = DateTime.Now;
        public DateTime UtcMissingDate { get; set; } = DateTime.UtcNow;
        public required string Notifaction { get; set; } = string.Empty;
    }
}
