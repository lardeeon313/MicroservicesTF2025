using FluentValidation;
using LogisticService.API.RequestDtos.LogisticOrders;
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
using LogisticService.Application.Services.IdentityServiceClient;
using LogisticService.Domain.Common.Interfaces;
using LogisticService.Domain.IRepositories;
using LogisticService.Infraestructure.Email;
using LogisticService.Infraestructure.Messaging.Consumer;
using LogisticService.Infraestructure.Messaging.Publisher;
using LogisticService.Infraestructure.Persistence;
using LogisticService.Infraestructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

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
            Name = "Milton Argüello, Bustos Santiago, Diego Aguirre"
        }
    });
});

//////////////// Inyeccion de dependencias //////////////////////

// Add FluentValidation
builder.Services.AddScoped<IValidator<CreateDeliveryTeamRequest>, CreateDeliveryTeamRequestValidator>();
builder.Services.AddScoped<IValidator<UpdateDeliveryTeamRequest>, UpdateDeliveryTeamRequestValidator>();

builder.Services.AddScoped<IValidator<UpdateDeliveryZoneRequest>, UpdateDeliveryZoneRequestValidator>();
builder.Services.AddScoped<IValidator<CreateDeliveryZoneRequest>, CreateDeliveryZoneRequestValidator>();

// Add RepositoriesS
builder.Services.AddScoped<IDeliveryTeamRepository, DeliveryTeamRepository>();
builder.Services.AddScoped<ILogisticOrderRepository, LogisticOrderRepository>();
builder.Services.AddScoped<ILogisticReportRepository, LogisticReportRepository>();
builder.Services.AddScoped<IDeliveryZoneRepository, DeliveryZoneRepository>();

///// Add Commands and Queries /////
    
//Commands CRUD LogisticDeliveryTeams
builder.Services.AddScoped<ICreateDeliveryTeamCommandHandler, CreateDeliveryTeamCommandHandler>();
builder.Services.AddScoped<IUpdateDeliveryTeamCommandHandler, UpdateDeliveryTeamCommandHandler>();
builder.Services.AddScoped<IDeleteDeliveryTeamCommandHandler, DeleteDeliveryTeamCommandHandler>();
builder.Services.AddScoped<IActiveDeliveryTeamCommandHandler, ActiveDeliveryTeamCommandHandler>();
builder.Services.AddScoped<IDisableDeliveryTeamCommandHandler, DisableDeliveryTeamCommandHandler>();
builder.Services.AddScoped<IAssignZoneToTeamCommandHandler , AssignZoneToTeamCommandHandler>();
builder.Services.AddScoped<IRemoveZoneFromTeamCommandHandler , RemoveZoneFromTeamCommandHandler>();
builder.Services.AddScoped<IAssignOperatorToTeamCommandHandler, AssignOperatorToTeamCommandHandler>();
builder.Services.AddScoped<IRemoveOperatorToTeamCommandHandler, RemoveOperatorToTeamCommandHandler>();

//Queries CRUD LogisticDeliveryTeams
builder.Services.AddScoped<IGetAllTeamsQueryHandler, GetAllTeamsQueryHandler>();
builder.Services.AddScoped<IGetTeamByIdQueryHandler, GetTeamByIdQueryHandler>();

//Commands CRUD LogisticDeliveryZones
builder.Services.AddScoped<ICreateDeliveryZoneCommandHandler, CreateDeliveryZoneCommandHandler>();
builder.Services.AddScoped<IUpdateDeliveryZoneCommandHandler, UpdateDeliveryZoneCommandHandler>();
builder.Services.AddScoped<IDeleteDeliverZoneCommandHandler, DeleteDeliverZoneCommandHandler>();
builder.Services.AddScoped<IActiveDeliveryZoneCommandHandler, ActiveDeliveryZoneCommandHandler>();
builder.Services.AddScoped<IDisableDeliveryZoneCommandHandler, DisableDeliveryZoneCommandHandler>();

//Queries CRUD LogisticDeliveryZones 
builder.Services.AddScoped<IGetAllDeliveryZonesQueryHandler, GetAllDeliveryZonesQueryHandler>();
builder.Services.AddScoped<IGetDeliveryZoneByIdQueryHandler, GetDeliveryZoneByIdQueryHandler>();

//Commands LogisticOrders
builder.Services.AddScoped<IAssignOrderCommandHandler, AssignOrderCommandHandler>();
builder.Services.AddScoped<IRemoveAssignOrderCommandHandler, RemoveAssignOrderCommandHandler>();
builder.Services.AddScoped<ISetDeliveryPriorityOrderCommandHandler, SetDeliveryPriorityOrderCommandHandler>();
builder.Services.AddScoped<IVerifiedOrderCommandHandler, VerifiedOrderCommandHandler>();
builder.Services.AddScoped<ICheckCashOrderCommandHandler, CheckCashOrderCommandHandler>();

//Queries LogisticOrders
builder.Services.AddScoped<IGetOrdersByDeliveryPriorityQueryHandler, GetOrdersByDeliveryPriorityQueryHandler>();
builder.Services.AddScoped<IGetAllOrdersQueryHandler, GetAllOrdersQueryHandler>();
builder.Services.AddScoped<IGetOrderByIdCustomerQueryHandler, GetOrderByIdCustomerQueryHandler>();
builder.Services.AddScoped<IGetOrderByIdQueryHandler, GetOrderByIdQueryHandler>();
builder.Services.AddScoped<IGetOrdersByStatusQueryHandler, GetOrdersByStatusQueryHandler>();
builder.Services.AddScoped<IGetPagedOrdersQueryHandler, GetPagedOrdersQueryHandler>();
builder.Services.AddScoped<IGetOrdersByDeliveryZoneIdQueryHandler, GetOrdersByDeliveryZoneIdQueryHandler>();
builder.Services.AddScoped<IGetOrdersByOperatorIdQueryHandler, GetOrdersByOperatorIdQueryHandler>();
builder.Services.AddScoped<IGetOrdersByTeamIdQueryHandler, GetOrdersByTeamIdQueryHandler>();
builder.Services.AddScoped<IGetOrdersDeliveryRejectionsQueryHandler, GetOrdersDeliveryRejectionsQueryHandler>();
builder.Services.AddScoped<IGetOrdersWithDeliveryIncidentQueryHandler, GetOrdersWithDeliveryIncidentQueryHandler>();
builder.Services.AddScoped<IGetRejectionReasonsByOrderIdQueryHandler, GetRejectionReasonsByOrderIdQueryHandler>();
builder.Services.AddScoped<IGetDeliveryIncidentByOrderIdQueryHandler, GetDeliveryIncidentByOrderIdQueryHandler>();

//Commands DeliveryOperator
builder.Services.AddScoped<IConfirmAssignedOrderCommandHandler, ConfirmAssignedOrderCommandHandler>();
builder.Services.AddScoped<IRejectAssignedOrderCommandHandler, RejectAssignedOrderCommandHandler>();
builder.Services.AddScoped<IMarkOrderDeliveredCommandHandler, MarkOrderDeliveredCommandHandler>();
builder.Services.AddScoped<IMarkOrderOnTheWayCommandHandler, MarkOrderOnTheWayCommandHandler>();
builder.Services.AddScoped<IReportDeliveryIncidentCommandHandler, ReportDeliveryIncidentCommandHandler>();
builder.Services.AddScoped<IResolveDeliveryIncidentCommandHandler, ResolveDeliveryIncidentCommandHandler>();

//Queries DeliveryOperator
builder.Services.AddScoped<IGetMyAssignedOrdersQueryHandler, GetMyAssignedOrdersQueryHandler>();
builder.Services.AddScoped<IGetMyPendingCashOrdersQueryHandler, GetMyPendingCashOrdersQueryHandler>();
builder.Services.AddScoped<IGetMyDeliveredOrdersQueryHandler, GetMyDeliveredOrdersQueryHandler>();
builder.Services.AddScoped<IGetMyPendingDeliveredOrdersQueryHandler, GetMyPendingDeliveredOrdersQueryHandler>();
builder.Services.AddScoped<IGetMyOnTheWayOrdersQueryHandler, GetMyOnTheWayOrdersQueryHandler>();
builder.Services.AddScoped<IGetMyOrdersWithDeliveryIncidentQueryHandler,  GetMyOrdersWithDeliveryIncidentQueryHandler>();
builder.Services.AddScoped<IGetMyRejectOrdersQueryHandler , GetMyRejectOrdersQueryHandler>();



// Add EmailService
builder.Services.AddScoped<IEmailService, MailgunEmailService>();

// RabbitMQ Consumer
builder.Services.AddHostedService<OrderInvoicedConsumer>();

// Identity Service Client 
builder.Services.AddHttpClient("IdentityService", client =>
{
    client.BaseAddress = new Uri("http://identityservice:8080/api/auth/");
});
builder.Services.AddScoped<IIdentityServiceClient, IdentityServiceClient>();
builder.Services.AddHttpContextAccessor();

// Add RabbitMQ Producer
builder.Services.AddScoped<IRabbitMQPublisher, RabbitMQPublisher>();

//////////////////// Configuracion DbContext //////////////////////

// Obtener la cadena de conexión del appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Registrar el DbContext
builder.Services.AddDbContext<LogisticDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
        b => b.MigrationsAssembly("LogisticService.API")));

/////////////////// Configuracion JWT ////////////////////

var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];

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

// Configuración de autorización
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

app.MapControllers();

app.Run();
