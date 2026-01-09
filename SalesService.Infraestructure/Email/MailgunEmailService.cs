using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SalesService.Domain.Common.Interfaces;
using SalesService.Infraestructure.Email.EmailTemplates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Infraestructure.Email
{
    public class MailgunEmailService : IEmailService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _domain;
        private readonly string _fromEmail;
        private readonly string _fromName;
        private readonly ILogger<MailgunEmailService> _logger;

        public MailgunEmailService(IConfiguration configuration, ILogger<MailgunEmailService> logger)
        {
            _httpClient = new HttpClient();
            _logger = logger;

            var mailSettings = configuration.GetSection("MailSettings");
            _apiKey = mailSettings["ApiKey"] ?? throw new ArgumentNullException("MailSettings:ApiKey");
            _domain = mailSettings["Domain"] ?? throw new ArgumentNullException("MailSettings:Domain");
            _fromEmail = mailSettings["FromEmail"] ?? throw new ArgumentNullException("MailSettings:FromEmail");
            _fromName = mailSettings["FromName"] ?? throw new ArgumentNullException("MailSettings:FromName");

            var byteArray = Encoding.ASCII.GetBytes($"api:{_apiKey}");
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));
        }

        public async Task SendEmailAsync(string to, string subject, string htmlBody)
        {
            var content = new MultipartFormDataContent
            {
                { new StringContent($"{_fromName} <{_fromEmail}>"), "from" },
                { new StringContent(to), "to" },
                { new StringContent(subject), "subject" },
                { new StringContent(htmlBody), "html" }
            };

            var response = await _httpClient.PostAsync(
                $"https://api.mailgun.net/v3/{_domain}/messages", content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                _logger.LogError("Mail sending failed: {Error}", error);
                throw new Exception($"Mail sending failed: {error}");
            }

            _logger.LogInformation("Email sent to {To} with subject {Subject}", to, subject);
        }
    }
}
