using FluentValidation;
using LogisticService.API.RequestDtos.LogisticOrders;
using LogisticService.API.RequestDtos.Reports;
using LogisticService.API.RequestDtos.VerificationManager.DeliveryTeams;
using LogisticService.API.RequestDtos.VerificationManager.DeliveryZones;
using LogisticService.API.Validators.DeliveryTeams;
using LogisticService.API.Validators.DeliveryZones;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ConfirmAssignedOrder;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.MarkOrderDelivered;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.MarkOrderOnTheWay;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.RejectAssignedOrder;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ReportDeliveryIncident;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ResolveDeliveryIncident;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.ActiveDeliveryTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.AssignOperatorToTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.AssignZoneToTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.CreateDeliveryTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.DeleteDeliveryTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.DisableDeliveryTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.RemoveOperatorToTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.RemoveZoneToTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.UpdateDeliveryTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryZone.ActiveDeliveryZone;
using LogisticService.Application.Commands.LogisticManager.DeliveryZone.CreateDeliveryZone;
using LogisticService.Application.Commands.LogisticManager.DeliveryZone.DeleteDeliveryZone;
using LogisticService.Application.Commands.LogisticManager.DeliveryZone.DisableDeliveryZone;
using LogisticService.Application.Commands.LogisticManager.DeliveryZone.UpdateDeliveryZone;
using LogisticService.Application.Commands.LogisticManager.LogisticOrder.AssignOrder;
using LogisticService.Application.Commands.LogisticManager.LogisticOrder.CheckCashOrder;
using LogisticService.Application.Commands.LogisticManager.LogisticOrder.RemoveAssignOrder;
using LogisticService.Application.Commands.LogisticManager.LogisticOrder.SetPriorityOrder;
using LogisticService.Application.Commands.LogisticManager.LogisticOrder.VerifiedOrder;
using LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyAssignedOrders;
using LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyDeliveredOrders;
using LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyOnTheWayOrders;
using LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyOrdersWithDeliveryIncident;
using LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyPendingCashOrders;
using LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyPendingDeliveredOrders;
using LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyRejectOrders;
using LogisticService.Application.Queries.LogisticManager.DeliveryTeam.GetAllTeams;
using LogisticService.Application.Queries.LogisticManager.DeliveryTeam.GetById;
using LogisticService.Application.Queries.LogisticManager.DeliveryTeam.GetTeamByDeliveryOperator;
using LogisticService.Application.Queries.LogisticManager.DeliveryZone.GetAllZones;
using LogisticService.Application.Queries.LogisticManager.DeliveryZone.GetByIdZone;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetAllOrders;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetAllOrdersByDeliveryPriority;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetDeliveryIncidentByOrderId;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetDRReasonByOrderId;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrderById;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersByCustomerId;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersByDeliveryZoneId;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersByOperatorId;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersByStatus;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersByTeamId;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersWithDeliveryIncident;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetPagedOrders;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetRejectionReasonsByOrderId;
using LogisticService.Application.Queries.LogisticReports;
using LogisticService.Application.Queries.LogisticReports.GetCustomersWithMostIncidentsReport;
using LogisticService.Application.Queries.LogisticReports.GetDeliveryIncidentReport;
using LogisticService.Application.Queries.LogisticReports.GetDeliveryRejectionsReport;
using LogisticService.Application.Queries.LogisticReports.GetDeliveryTeamActivityReport;
using LogisticService.Application.Queries.LogisticReports.GetDeliveryTimeReport;
using LogisticService.Application.Queries.LogisticReports.GetOperatorProductivityReport;
using LogisticService.Application.Queries.LogisticReports.GetOrdersByStatusReport;
using LogisticService.Application.Queries.LogisticReports.GetOrderStatusHistoryReport;
using LogisticService.Application.Queries.LogisticReports.GetPendingCashVerificationReport;
using LogisticService.Application.Queries.LogisticReports.GetZonePerformanceReport;
using LogisticService.Application.Services.IdentityServiceClient;
using LogisticService.Domain.Common.Interfaces;
using LogisticService.Domain.IRepositories;
using LogisticService.Infraestructure.Email;
using LogisticService.Infraestructure.Messaging.Consumer;
using LogisticService.Infraestructure.Messaging.Publisher;
using LogisticService.Infraestructure.Persistence;
using LogisticService.Infraestructure.Persistence.Repositories;
using LogisticService.Infraestructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    EnvironmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"
});

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);

    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Logistic Service API",
        Version = "v1",
        Description = "Microservicio encargado de la verificacion de pagos y gestion de la logistca del pedido.",
        Contact = new OpenApiContact
        {
            Name = "Milton Arg?ello, Bustos Santiago, Diego Aguirre"
        }
    });
});

// Add RabbitMQ Producer
builder.Services.AddScoped<IRabbitMQPublisher, RabbitMQPublisher>();

//////////////////// Configuracion DbContext //////////////////////

// Obtener las variables de configuración
var connectionString = builder.Configuration["ConnectionStrings:DefaultConnection"];
var rabbitHost = builder.Configuration["RabbitMQ:Host"];
var rabbitPort = builder.Configuration["RabbitMQ:Port"];
var rabbitUser = builder.Configuration["RabbitMQ:Username"];
var rabbitPass = builder.Configuration["RabbitMQ:Password"];
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var mailApi = builder.Configuration["MailSettings:ApiKey"];

// Registrar el DbContext
builder.Services.AddDbContext<LogisticDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
        b => b.MigrationsAssembly("LogisticService.API")));

// Configuración de autenticación JWT
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// Configuraci?n de autorizaci?n
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("LogisticAcces", policy =>
        policy.RequireClaim("role", "VerificationManager, DeliveryOperator"));


var app = builder.Build();

// Migrar automaticamente, cada vez que levante el servicio.
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<LogisticDbContext>();
    dbContext.Database.Migrate();
}


if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Logistic Service API V1");
        c.RoutePrefix = string.Empty;
    });
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();

app.UseAuthorization();

app.UseDeveloperExceptionPage();

app.MapControllers();

app.Run();