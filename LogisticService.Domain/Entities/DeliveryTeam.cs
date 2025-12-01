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
        public DeliveryTeam()
        {
            
        }
        public DeliveryTeam(string teamName)
        {
            TeamName = teamName;
        }
        public DeliveryTeam(string teamName, string? teamDescription)
        {
            if (string.IsNullOrWhiteSpace(teamName))
                throw new ArgumentException("El nombre del equipo no puede estar vacío.", nameof(teamName));

            TeamName = teamName;
            TeamDescription = teamDescription;
        }

        public DeliveryTeam(int id, string teamName, bool isActive)
        {
            Id = id;
            TeamName = teamName;
            IsActive = isActive;
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

        /// Asigna un operador al equipo si no está asignado.
        public void AssignOperator(Guid userId)
        {
            if (DeliveryOperators.Any(a => a.OperatorUserId == userId))
                throw new InvalidOperationException("El operador ya está asignado a este equipo.");

            DeliveryOperators.Add(new DeliveryTeamMemberAssignment
            {
                OperatorUserId = userId,
                DeliveryTeamId = Id,
                AssignedAt = DateTime.UtcNow,
                RoleInTeam = "Delivery Operator" // Asignar rol por defecto
            });
        }

        
        /// Remueve un operador del equipo.        
        public void RemoveOperator(Guid userId)
        {
            var assignment = DeliveryOperators.FirstOrDefault(a => a.OperatorUserId == userId);
            if (assignment == null)
                throw new InvalidOperationException("El operador no está asignado a este equipo.");
            DeliveryOperators.Remove(assignment);
        }

        /// Asigna una zona al equipo si no está asignado.
        public void AssignZone(int zoneId)
        {
            if (ZoneAssignments.Any(a => a.DeliveryZoneId == zoneId))
                throw new InvalidOperationException("La zona ya está asignada a este equipo.");

            ZoneAssignments.Add(new DeliveryTeamZoneAssignment
            {
                DeliveryZoneId = zoneId,
                DeliveryTeamId = Id,
                AssignedAt = DateTime.UtcNow,
            });
        }

        /// Remueve una zona del equipo.        
        public void RemoveZone(int zoneId)
        {
            var assignment = ZoneAssignments.FirstOrDefault(a => a.DeliveryZoneId == zoneId);
            if (assignment == null)
                throw new InvalidOperationException("La zona no está asignada a este equipo.");
            ZoneAssignments.Remove(assignment);
        }

    }
}
