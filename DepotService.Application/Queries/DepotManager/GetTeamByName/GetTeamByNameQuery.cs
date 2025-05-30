using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetTeamByName
{
    public class GetTeamByNameQuery
    {
        public string TeamName { get; set; } = string.Empty;

        public GetTeamByNameQuery(string teamName)
        {
            TeamName = teamName;
        }
    }
}
