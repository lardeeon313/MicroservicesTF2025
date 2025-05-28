using Microsoft.AspNetCore.Http;
using SalesService.Application.DTOs.User;
using SalesService.Infraestructure.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SalesService.Application.Services.IdentityServiceClient
{
    public class IdentityServiceClient : IIdentityServiceClient
    {
        private readonly HttpClient _httpClient;
        private const string SalesStaffsEndpoint = "salesstaffs";
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IdentityServiceClient(IHttpClientFactory httpClientFactory, IHttpContextAccessor httpContextAccessor)
        {
            _httpClient = httpClientFactory.CreateClient("IdentityService");
            _httpContextAccessor = httpContextAccessor;
        }

        // Definir JsonSerializerOptions como una instancia estática reutilizable
        private static readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
        };

        public async Task<List<SalesStaffDto>> GetSalesStaffsAsync()
        {

            // Obtener el token desde el contexto HTTP
            var accessToken = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].ToString();

            if (!string.IsNullOrEmpty(accessToken))
            {
                _httpClient.DefaultRequestHeaders.Remove("Authorization"); // Evitamos token's duplicados
                _httpClient.DefaultRequestHeaders.Add("Authorization", accessToken);
            }

            // Realizar la solicitud GET a la API de Identity Service
            var response = await _httpClient.GetAsync("salesstaffs");

            // Verificar si la respuesta es exitosa (código 2xx)
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException(
                    $"Error al obtener los vendedores: {response.StatusCode}. Contenido: {errorContent}");
            }

            // Leer el contenido de la respuesta y deserializarlo a una lista de SalesStaffDto
            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<List<SalesStaffDto>>(json, _jsonOptions);

            // Verificar si la deserialización fue exitosa
            if (result == null)
            {
                // Puedes lanzar una excepción o registrar un error
                throw new Exception("Error al deserializar la respuesta de la API");
            }

            // Retornar la lista de SalesStaffDto
            return result;
        }
    }
}
