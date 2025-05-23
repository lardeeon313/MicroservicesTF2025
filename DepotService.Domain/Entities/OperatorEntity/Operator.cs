using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DepotService.Domain.Enums.DepotTeam;

namespace DepotService.Domain.Entities.Operator
{
    public class Operator
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string FirstName { get; set; } 
        public required string LastName { get; set; }
        public required string Password { get;set; } 
        public required string Emial { get; set; }
        //ROL 
        public DepotTeam RolTeam { get; set; } 
        public DateTime DateStatement { get; set; } = DateTime.Now;
    }
}
