using AdminService.Application.Services;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace AdminService.Application.Services.DepotService
{
    public class DepotServiceClient : IDepotServiceClient
    {
        private readonly HttpClient _httpClient;       
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DepotServiceClient(IHttpClientFactory httpClientFactory, IHttpContextAccessor httpContextAccessor)
        {
            _httpClient = httpClientFactory.CreateClient("DepotService");
            _httpContextAccessor = httpContextAccessor;
        }

        // Definir JsonSerializerOptions como una instancia estática reutilizable
        private static readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
        };

    }
}
