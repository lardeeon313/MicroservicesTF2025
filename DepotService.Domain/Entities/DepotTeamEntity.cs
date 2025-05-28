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
        public List<Guid?> OperatorUserIds { get; set; } = new();

        // Constructor protegido para EF Core
        private DepotTeamEntity() { }

        public DepotTeamEntity(string teamName)
        {
            if (string.IsNullOrWhiteSpace(teamName))
                throw new ArgumentException("El nombre del equipo no puede estar vacío.", nameof(teamName));

            TeamName = teamName;
        }
        public void UpdateName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("El nombre no puede estar vacío.", nameof(name));

            TeamName = name;
        }

        /// <summary>
        /// Asigna un operador al equipo si no está asignado.
        /// </summary>
        public void AssignOperator(Guid userId)
        {
            if (OperatorUserIds.Contains(userId))
                throw new InvalidOperationException("El operador ya está asignado a este equipo.");

            OperatorUserIds.Add(userId);
        }

        /// <summary>
        /// Remueve un operador del equipo.
        /// </summary>

        public void RemoveOperator(Guid userId)
        {
            if (!OperatorUserIds.Contains(userId))
                throw new InvalidOperationException("El operador no pertenece a este equipo.");

            OperatorUserIds.Remove(userId);
        }
    }
}
