using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs
{
    public class LogisticAddressDto
    {
        public int Id { get; set; }
        public string Street { get; set; } = string.Empty;
        public string Number { get; set; } = string.Empty;
        public string? Apartment { get; set; }

        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string? PostalCode { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? FormattedAddress { get; set; }
    }
}
