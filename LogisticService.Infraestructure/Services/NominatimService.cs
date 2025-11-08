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
            if (string.IsNullOrWhiteSpace(fullAddress))
            {
                _logger.LogWarning("⚠️ Dirección vacía o nula. Usando fallback Córdoba Capital.");
                return (-31.4201, -64.1888, "Córdoba, Argentina");
            }

            // 🧩 Si la dirección no incluye Córdoba, la agregamos
            string query = fullAddress.Contains("Córdoba", StringComparison.OrdinalIgnoreCase)
                ? fullAddress
                : $"{fullAddress}, Córdoba, Argentina";

            var url = $"https://nominatim.openstreetmap.org/search?format=json&q={Uri.EscapeDataString(query)}";

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
                    // 🔎 Busca el resultado que contenga "Córdoba" en el display name
                    var cordobaMatch = results.FirstOrDefault(r =>
                        r.DisplayName.Contains("Córdoba", StringComparison.OrdinalIgnoreCase));

                    var selected = cordobaMatch ?? results[0];

                    var lat = double.Parse(selected.Lat, System.Globalization.CultureInfo.InvariantCulture);
                    var lon = double.Parse(selected.Lon, System.Globalization.CultureInfo.InvariantCulture);

                    // 🧭 Verificamos si el punto está dentro del rango razonable de Córdoba Capital
                    if (Math.Abs(lat - (-31.42)) > 1 || Math.Abs(lon - (-64.18)) > 1)
                    {
                        _logger.LogWarning("⚠️ Coordenadas fuera de Córdoba Capital, usando fallback.");
                        return (-31.4201, -64.1888, "Córdoba, Argentina");
                    }

                    _logger.LogInformation("✅ Coordenadas válidas para {Address}: {Lat}, {Lon}", fullAddress, lat, lon);
                    return (lat, lon, selected.DisplayName);
                }

                _logger.LogWarning("⚠️ No se encontraron resultados para: {Address}. Usando fallback Córdoba.", fullAddress);
                return (-31.4201, -64.1888, "Córdoba, Argentina");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error al geocodificar dirección: {Address}", fullAddress);
                return (-31.4201, -64.1888, "Córdoba, Argentina");
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
