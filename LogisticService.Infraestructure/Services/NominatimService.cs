using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace LogisticService.Infraestructure.Services
{
    public class NominatimService : INominatimService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<NominatimService> _logger;

        public NominatimService(HttpClient httpClient, ILogger<NominatimService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }


        public async Task<(double lat, double lon, string formatted)> GeocodeAddressAsync(string fullAddress)
        {
            var url = $"https://nominatim.openstreetmap.org/search?format=json&q={Uri.EscapeDataString(fullAddress)}";

            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("LogisticService/1.0 (+tuemail@tudominio.com)");

            try
            {
                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var results = JsonSerializer.Deserialize<List<NominatimResult>>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (results != null && results.Count > 0)
                {
                    var first = results[0];
                    return (double.Parse(first.Lat), double.Parse(first.Lon), first.DisplayName);
                }

                _logger.LogWarning("No geocode results for address: {Address}", fullAddress);
                return (0, 0, fullAddress);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling Nominatim API for address {Address}", fullAddress);
                return (0, 0, fullAddress);
            }
        }

        private class NominatimResult
        {
            public string Lat { get; set; } = string.Empty;
            public string Lon { get; set; } = string.Empty;
            public string DisplayName { get; set; } = string.Empty;
        }
    }
}
