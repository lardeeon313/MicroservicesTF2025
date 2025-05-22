using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.DTOs
{
    /// <summary>
    /// Modelo de solicitud para inicio de usuario.
    /// </summary>
    public class LoginRequest
    {
        [Required, EmailAddress]
        [Display(Name = "Email adress")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Password")]
        public string Password { get; set; } = string.Empty;
    }
}
