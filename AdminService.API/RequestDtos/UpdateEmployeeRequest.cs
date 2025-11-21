using AdminService.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace AdminService.API.RequestDtos
{
    public class UpdateEmployeeRequest
    {
        public int Id { get; set; }
        [Required, MaxLength(50)]
        [Display(Name = "Username")]
        public string UserName { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        [Display(Name = "FirstName")]
        public string FirstName { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        [Display(Name = "Lastname")]
        public string LastName { get; set; } = string.Empty;

        [Required, EmailAddress]
        [Display(Name = "Email adress")]
        public string Email { get; set; } = string.Empty;

        [Required, Phone]
        [Display(Name = "Phone Number")]
        public string PhoneNumber { get; set; } = string.Empty;
        public EmployeeRole Role { get; set; }
        public EmployeeStatus Status { get; set; }
        public EmployeeSector Sector { get; set; }
    }
}
