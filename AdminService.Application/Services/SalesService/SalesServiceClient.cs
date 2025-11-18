using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace AdminService.Application.Services.SalesService
{
    public class SalesServiceClient : ISalesServiceClient
    {
        private readonly HttpClient _httpClient;       
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SalesServiceClient(IHttpClientFactory httpClientFactory, IHttpContextAccessor httpContextAccessor)
        {
            _httpClient = httpClientFactory.CreateClient("SalesService");
            _httpContextAccessor = httpContextAccessor;
        }

        // Definir JsonSerializerOptions como una instancia estática reutilizable
        private static readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
        };

    }
}
