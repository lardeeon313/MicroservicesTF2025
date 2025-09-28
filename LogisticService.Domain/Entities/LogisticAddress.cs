using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Domain.Entities
{
    public class LogisticAddress
    {
        public int Id { get; set; }

        // Información básica de la dirección
        public string Street { get; set; } = string.Empty;     // Calle
        public string Number { get; set; } = string.Empty;     // Altura / numeración
        public string? Apartment { get; set; }                 // Depto, piso, etc.

        // Jerarquía de ubicación
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string? PostalCode { get; set; }

        // Para integración con Google Maps
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? FormattedAddress { get; set; }          // lo que devuelva Google Maps al validar

        // Auditoría
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
