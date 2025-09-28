using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryZone.UpdateDeliveryZone
{
    public class UpdateDeliveryZoneCommand 
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public UpdateDeliveryZoneCommand(int id, string name, string? description)
        {
            Id = id;
            Name = name;
            Description = description;
        }
    }
}
