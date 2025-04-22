using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Verification.Infraestructure
{
    public class VerificationDbContext : DbContext
    {
        public VerificationDbContext(DbContextOptions<VerificationDbContext> options) : base(options)
        {
        }
    }
}
