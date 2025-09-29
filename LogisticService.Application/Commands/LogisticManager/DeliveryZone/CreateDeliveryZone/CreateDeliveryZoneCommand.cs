using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryZone.CreateDeliveryZone
{
    public class CreateDeliveryZoneCommand
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public CreateDeliveryZoneCommand(string name, string? description)
        {
            Name = name;
            Description = description;
        }
    }
}
