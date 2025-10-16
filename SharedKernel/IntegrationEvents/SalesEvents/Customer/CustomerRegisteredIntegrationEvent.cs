using SalesService.Domain.Enums;
using SharedKernel.IntegrationEvents.PaymentTypes;
using SharedKernel.IntegrationEvents.SalesEvents.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.IntegrationEvents.SalesEvents.Customer
{
    public class CustomerRegisteredIntegrationEvent
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public List<AddressDto> Addresses { get; set; } = new List<AddressDto>();
        public List<PaymentType> PaymentTypes { get; set; } = new();
        public DateTime CreatedAt { get; set; }

    }
}
