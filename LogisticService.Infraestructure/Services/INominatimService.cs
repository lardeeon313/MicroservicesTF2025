using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Infraestructure.Services
{
    public interface INominatimService
    {
        Task<(double lat, double lon, string formatted)> GeocodeAddressAsync(string fullAddress);
    }
}
