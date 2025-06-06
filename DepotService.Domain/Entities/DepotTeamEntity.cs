using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.Entities
{
    public class DepotTeamEntity
    {
        public int Id { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public string? TeamDescription { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public List<DepotTeamAssignment> Assignments { get; set; } = new();


        // Constructor protegido para EF Core
        private DepotTeamEntity() { }

        public DepotTeamEntity(string teamName, string? teamDescription)
        {
            if (string.IsNullOrWhiteSpace(teamName))
                throw new ArgumentException("El nombre del equipo no puede estar vacío.", nameof(teamName));

            TeamName = teamName;
            TeamDescription = teamDescription;
        }
        public void UpdateTeam(string name, string? teamDescription)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("El nombre no puede estar vacío.", nameof(name));

            TeamName = name;
            if (teamDescription is not null)
                TeamDescription = teamDescription;

        }

        /// <summary>
        /// Asigna un operador al equipo si no está asignado.
        /// </summary>
        public void AssignOperator(Guid userId)
        {
            if (Assignments.Any(a => a.OperatorUserId == userId))
                throw new InvalidOperationException("El operador ya está asignado a este equipo.");

            Assignments.Add(new DepotTeamAssignment
            {
                OperatorUserId = userId,
                DepotTeamId = Id,
                AssignedAt = DateTime.UtcNow,
                RoleInTeam = "Operator" // Asignar rol por defecto
            });
        }

        /// <summary>
        /// Remueve un operador del equipo.
        /// </summary>

        public void RemoveOperator(Guid userId)
        {
            var assignment = Assignments.FirstOrDefault(a => a.OperatorUserId == userId);
            if (assignment == null)
                throw new InvalidOperationException("El operador no está asignado a este equipo.");
            Assignments.Remove(assignment);
        }
    }
}
