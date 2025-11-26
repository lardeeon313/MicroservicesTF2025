using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.DTOs
{
    public class ForgotPasswordResponse
    {
        public bool RequiresPasswordCreation { get; set; }

        public string? UserId { get; set; }
    }
}
