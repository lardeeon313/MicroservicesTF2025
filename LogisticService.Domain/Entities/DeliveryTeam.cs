using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Domain.Entities
{
    public class DeliveryTeam
    {
        public int Id { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public string? TeamDescription { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        // Miembros del equipo
        public List<DeliveryTeamMemberAssignment> DeliveryOperators { get; set; } = new();

        // Zonas que cubre el equipo (entidad intermedia)
        public List<DeliveryTeamZoneAssignment> ZoneAssignments { get; set; } = new();

        // Constructor por defecto
        protected DeliveryTeam()
        {            
        }

        public DeliveryTeam(string teamName, string? teamDescription)
        {
            if (string.IsNullOrWhiteSpace(teamName))
                throw new ArgumentException("El nombre del equipo no puede estar vacío.", nameof(teamName));

            TeamName = teamName;
            TeamDescription = teamDescription;
        }

        // Metodo para actualizar el equipo
        public void UpdateTeam(string name, string? teamDescription)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("El nombre no puede estar vacío.", nameof(name));
            TeamName = name;
            if (teamDescription is not null)
                TeamDescription = teamDescription;
        }

        // Metodo para Inhabilitar un equipo
        public void Disable()
        {
            if (!IsActive)
                throw new InvalidOperationException("The team is already disabled.");

            IsActive = false;
        }

        // Metodo para Habilitar un equipo
        public void Active()
        {
            if (IsActive)
                throw new InvalidOperationException("The team is already active.");

            IsActive = true;
        }

    }
}
