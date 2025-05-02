using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.Entities
{
    public class Customer
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required, MaxLength(50)]
        [Display(Name = "FirtsName")]
        public string FirstName  { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        [Display(Name = "LastName")]
        public string? LastName { get; set; } = string.Empty;
        [Required, MaxLength(50)]
        [Display(Name = "Email")]
        public  string Email { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        [Display(Name = "PhoneNumber")]
        public string PhoneNumber { get; set; } = string.Empty;
        [Required, MaxLength(50)]
        [Display(Name = "Address")]
        public string Address { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
    }
}
