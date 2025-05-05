using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Common
{
    public class CommandResult
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
    }
}
