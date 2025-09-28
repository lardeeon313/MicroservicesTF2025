using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Domain.Entities
{
    public class DeliveryZone
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; 
        public string? Description { get; set; }
        public bool IsActive { get; set; }

        // Relaciones inversas
        public List<DeliveryTeamZoneAssignment> ZoneAssignments { get; set; } = new();

        protected DeliveryZone() { }

        public DeliveryZone(string name, string? description)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Zone name cannot be empty.", nameof(name));

            Name = name;
            Description = description;
        }

        public void Update(string name, string? description)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Zone name cannot be empty.", nameof(name));

            Name = name;
            Description = description;
        }

        // Metodo para Inhabilitar una zona
        public void Disable()
        {
            if (!IsActive)
                throw new InvalidOperationException("The zone is already disabled.");

            IsActive = false;
        }

        // Metodo para Habilitar una zona
        public void Active()
        {
            if (IsActive)
                throw new InvalidOperationException("The zone is already active.");

            IsActive = true;
        }
    }
}
