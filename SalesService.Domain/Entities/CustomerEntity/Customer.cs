using SalesService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.Entities.CustomerEntity
{
    public class Customer
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;
        
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

        public CustomerStatus Status { get; set; } = CustomerStatus.Inactive;
        public string? SatisfactionDescription { get; set; }
        public int? SatisfactionScore { get; set; }
        public List<Address> Addresses { get; set; } = [];
        public List<CustomerPaymentType> PaymentTypes { get; set; } = [];
        public bool IsActive { get; set; } = true;

        // Metodo para Inhabilitar un Customer
        public void Desactivate()
        {
            if (!IsActive)
                throw new InvalidOperationException("The Customer is already disabled.");

            IsActive = false;
        }

        // Metodo para Habilitar un Customer
        public void Active()
        {
            if (IsActive)
                throw new InvalidOperationException("The Customer is already active.");

            IsActive = true;
        }
    }
}
