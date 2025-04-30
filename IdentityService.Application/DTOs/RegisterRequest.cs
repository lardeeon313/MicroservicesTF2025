using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.DTOs
{
    /// <summary>
    /// Modelo de solicitud para registro de usuario.
    /// </summary>
    public class RegisterRequest
    {
        [Required, MaxLength(50)]
        [Display(Name = "Username")]
        public string UserName { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        [Display(Name = "Name")]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        [Display(Name = "Lastname")]
        public string LastName { get; set; } = string.Empty;

        [Required, EmailAddress]
        [Display(Name = "Email adress")]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(6)]
        [Display(Name = "Password")]
        public string Password { get; set; } = string.Empty;
    }
}
