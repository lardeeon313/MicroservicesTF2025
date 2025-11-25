//
using DepotService.Application.Commands.BillingManager.ExportInvoiceOrderPdf;
using DepotService.Application.Commands.BillingManager.InvoicedOrder;
using DepotService.Application.Commands.BillingManager.SetItemUnitPrices;
using DepotService.Application.Commands.BillingManager.UpdateInvoicedItemPrice;
using DepotService.Application.Commands.DepotManager.AssignOperator;
using DepotService.Application.Commands.DepotManager.AssignOrder;
using DepotService.Application.Commands.DepotManager.CreateTeam;
using DepotService.Application.Commands.DepotManager.DeleteTeam;
using DepotService.Application.Commands.DepotManager.OrderMissingReported;
using DepotService.Application.Commands.DepotManager.RemoveOperatorToTeam;
using DepotService.Application.Commands.DepotManager.UpdateTeam;
using DepotService.Application.Commands.DepotOperator.AddPackaing;
using DepotService.Application.Commands.DepotOperator.ConfirmAssignedOrder;
using DepotService.Application.Commands.DepotOperator.MarkItemReady;
using DepotService.Application.Commands.DepotOperator.RejectOrder;
using DepotService.Application.Commands.DepotOperator.ReportOrderMissing;
using DepotService.Application.Commands.DepotOperator.SentOrderToBilling;
using DepotService.Application.Commands.DepotOperator.UnMarkItemReady;
using DepotService.Application.DTOs.DepotManager.Request;
using DepotService.Application.DTOs.DepotOperator.Request;
using DepotService.Application.Queries.BillingManager.GetAllInvoicedOrders;
using DepotService.Application.Queries.BillingManager.GetBillingDetailsByOrder;
using DepotService.Application.Queries.BillingManager.GetInvoicedOrderById;
using DepotService.Application.Queries.BillingManager.GetInvoicedOrdersByCustomer;
using DepotService.Application.Queries.BillingManager.GetInvoicedOrdersByDateRange;
using DepotService.Application.Queries.BillingManager.GetOrdersPendingBilling;
using DepotService.Application.Queries.DepotManager.GetAllMissingOrders;
using DepotService.Application.Queries.DepotManager.GetAllOrders;
using DepotService.Application.Queries.DepotManager.GetAllTeams;
using DepotService.Application.Queries.DepotManager.GetByIdOrder;
using DepotService.Application.Queries.DepotManager.GetMissingOrderById;
using DepotService.Application.Queries.DepotManager.GetOrdersByStatus;
using DepotService.Application.Queries.DepotManager.GetTeamById;
using DepotService.Application.Queries.DepotManager.GetTeamByName;
using DepotService.Application.Queries.Operator.GetAssignedPendingOrders;
using DepotService.Application.Queries.Operator.GetOrderById;
using DepotService.Application.Queries.Operator.GetOrdersByOperatorQuery;
using DepotService.Application.Queries.Operator.GetOrdersPreparedOrSentToBilling;
using DepotService.Application.Queries.Operator.IGetOrdersMissingOrPreparing;
using DepotService.Application.Queries.Reports.GetAverageDepotProcessingTime;
using DepotService.Application.Queries.Reports.GetAverageTimePerStatus;
using DepotService.Application.Queries.Reports.GetDepotTeamPerformance;
using DepotService.Application.Queries.Reports.GetOrdersByDeliveryDate;
using DepotService.Application.Queries.Reports.GetOrdersCompleted;
using DepotService.Application.Queries.Reports.GetOrdersInPreparation;
using DepotService.Application.Queries.Reports.GetOrderStatusCount;
using DepotService.Application.Queries.Reports.GetProcessingTimePerOrder;
using DepotService.Application.Queries.Reports.GetReissuedReportOrders;
using DepotService.Application.Services.IdentityServiceClient;
using DepotService.Application.Validators.BillingManager;
using DepotService.Application.Validators.DepotManager;
using DepotService.Application.Validators.DepotOperator;
using DepotService.Domain.Common.Interfaces;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using DepotService.Infraestructure.Documents;
using DepotService.Infraestructure.Documents.Excel;
using DepotService.Infraestructure.Documents.Pdf;
using DepotService.Infraestructure.Documents.Word;
using DepotService.Infraestructure.Email;
using DepotService.Infraestructure.Messaging;
using DepotService.Infraestructure.Messaging.Consumers.LogisticConsumers;
using DepotService.Infraestructure.Messaging.Consumers.SalesConsumers;
using DepotService.Infraestructure.Messaging.Publisher;
using DepotService.Infraestructure.Persistence.Repositories;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
//para acceder desde el celular
//builder.WebHost.UseUrls("http://0.0.0.0:5003");

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);

    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Depot Service API",
        Version = "v1",
        Description = "The microservice is responsible for capturing orders and working for it.",
        Contact = new OpenApiContact
        {
            Name = "Milton Argüello, Bustos Santiago, Diego Aguirre"
        }
    });
});

// Add Queries
builder.Services.AddScoped<IGetAllTeamsQueryHandler, GetAllTeamsQueryHandler>();
builder.Services.AddScoped<IGetTeamByNameQueryHandler, GetTeamByNameQueryHandler>();
builder.Services.AddScoped<IGetTeamByIdQueryHandler, GetTeamByIdQueryHandler>();
builder.Services.AddScoped<IGetMissingOrderByIdQueryHandler, GetMissingOrderByIdQueryHandler>();
builder.Services.AddScoped<IGetAllMissingOrdersQueryHandler, GetAllMissingOrdersQueryHandler>();
builder.Services.AddScoped<IGetAllOrdersQueryHandler, GetAllOrdersQueryHandler>();
builder.Services.AddScoped<IGetOrdersByStatusQueryHandler, GetOrdersByStatusQueryHandler>();
builder.Services.AddScoped<IGetByIdOrderQueryHandler, GetByIdOrderQueryHandler>();
builder.Services.AddScoped<IGetOrdersByOperatorQueryHandler, GetOrdersByOperatorQueryHandler>();
builder.Services.AddScoped<IGetOrderByIdQueryHandler, GetOrderByIdQueryHandler>();
builder.Services.AddScoped<IGetAssignedPendingOrdersQueryHandler, GetAssignedPendingOrdersQueryHandler>();
builder.Services.AddScoped<IGetOrdersPendingBillingQueryHandler, GetOrdersPendingBillingQueryHandler>();
builder.Services.AddScoped<IGetBillingDetailsByOrderIdQueryHandler, GetBillingDetailsByOrderIdQueryHandler>();
builder.Services.AddScoped<IGetOrdersPendingBillingQueryHandler, GetOrdersPendingBillingQueryHandler>();
builder.Services.AddScoped<ISetItemUnitPricesCommandHandler, SetItemUnitPricesCommandHandler>();
builder.Services.AddScoped<IGetAllInvoicedOrdersQueryHandler, GetAllInvoicedOrdersQueryHandler>();
builder.Services.AddScoped<IGetInvoicedOrderByIdQueryHandler, GetInvoicedOrderByIdQueryHandler>();
builder.Services.AddScoped<IGetInvoicedOrdersByDateRangeQueryHandler, GetInvoicedOrdersByDateRangeQueryHandler>();
builder.Services.AddScoped<IGetInvoicedOrdersByCustomerQueryHandler, GetInvoicedOrdersByCustomerQueryHandler>();
builder.Services.AddScoped<IExportInvoiceDocumentCommandHandler, ExportInvoiceDocumentCommandHandler>();
builder.Services.AddScoped<IGetAverageTimePerStatusQueryHandler, GetAverageTimePerStatusQueryHandler>();
builder.Services.AddScoped<IGetOrderCountPerStatusQueryHandler, GetOrderCountPerStatusQueryHandler>();
builder.Services.AddScoped<IGetProcessingTimePerOrderQueryHandler, GetProcessingTimePerOrderQueryHandler>();
builder.Services.AddScoped<IGetDepotTeamPerformanceQueryHandler, GetDepotTeamPerformanceQueryHandler>();
builder.Services.AddScoped<IGetOrdersByDeliveryDateQueryHandler, GetOrdersByDeliveryDateQueryHandler>();
builder.Services.AddScoped<IGetReissuedOrdersQueryHandler, GetReissuedOrdersQueryHandler>();
builder.Services.AddScoped<IGetOrdersCompletedQueryHandler, GetOrdersCompletedQueryHandler>();
builder.Services.AddScoped<IGetOrdersInPreparationQueryHandler, GetOrdersInPreparationQueryHandler>();
builder.Services.AddScoped<IGetOrdersMissingOrPreparingHandler, GetOrdersMissingOrPreparingHandler>();
builder.Services.AddScoped<IGetOrdersPreparedOrSentToBillingHandler, GetOrdersPreparedOrSentToBillingHandler>();

// Add Commands
builder.Services.AddScoped<IAssignOperatorCommandHandler, AssignOperatorCommandHandler>();
builder.Services.AddScoped<IAssignOrderCommandHandler, AssignOrderCommandHandler>();
builder.Services.AddScoped<ICreateTeamCommandHandler, CreateTeamCommandHandler>();
builder.Services.AddScoped<IDeleteTeamCommandHandler, DeleteTeamCommandHandler>();
builder.Services.AddScoped<IUpdateTeamCommandHandler, UpdateTeamCommandHandler>();
builder.Services.AddScoped<IRemoveOperatorCommandHandler, RemoveOperatorCommandHandler>();
builder.Services.AddScoped<IOrderMissingReportedCommandHandler, OrderMissingReportedCommandHandler>();
builder.Services.AddScoped<IConfirmAssignedOrderCommandHandler, ConfirmAssignedOrderCommandHandler>();
builder.Services.AddScoped<IReportOrderMissingCommandHandler, ReportOrderMissingCommandHandler>();
builder.Services.AddScoped<IAddPackaingCommandHandler, AddPackaingCommandHandler>();
builder.Services.AddScoped<ISentToBillingCommandHandler, SentToBillingCommandHandler>();
builder.Services.AddScoped<IRejectOrderCommandHandler, RejectOrderCommandHandler>();
builder.Services.AddScoped<IMarkItemCommandHandler, MarkItemCommandHandler>();
builder.Services.AddScoped<IUnmarkItemReadyCommandHandler, UnmarkItemReadyCommandHandler>();
builder.Services.AddScoped<IInvoiceOrderCommandHandler, InvoiceOrderCommandHandler>();
builder.Services.AddScoped<ISetItemUnitPricesCommandHandler, SetItemUnitPricesCommandHandler>();
builder.Services.AddScoped<IUpdateInvoicedItemPriceCommandHandler, UpdateInvoicedItemPriceCommandHandler>();
builder.Services.AddScoped<IExportInvoiceDocumentCommandHandler, ExportInvoiceDocumentCommandHandler>();
builder.Services.AddScoped<IInvoicedOrdersReportPdfGenerator, InvoicedOrdersReportPdfGenerator>();
builder.Services.AddScoped<IInvoicedOrdersByCustomerPdfGenerator, InvoicedOrdersByCustomerPdfGenerator>();


// Add FluentValidation
builder.Services.AddScoped<IValidator<AssignOperatorRequest>, AssignOperatorCommandValidator>();
builder.Services.AddScoped<IValidator<CreateTeamRequest>, CreateTeamCommandValidator>();
builder.Services.AddScoped<IValidator<UpdateTeamRequest>, UpdateTeamCommandValidator>();
builder.Services.AddScoped<IValidator<AssignOrderRequest>, AssignOrderCommandValidator>();
builder.Services.AddScoped<IValidator<ReportOrderMissingRequest>, ReportOrderMissingValidator>();
builder.Services.AddScoped<IValidator<AddPackagingCommand>, AddPackaingCommandValidator>();
builder.Services.AddScoped<IValidator<RejectOrderCommand>, RejectOrderCommandValidator>();
builder.Services.AddScoped<IValidator<MarkItemCommand>, MarkItemIsReadyCommandValidator>();
builder.Services.AddScoped<IValidator<UnmarkItemReadyCommand>, UnmarkItemReadyValidator>();
builder.Services.AddScoped<IValidator<SetItemUnitPricesCommand>, SetItemUnitPricesCommandValidator>();
builder.Services.AddScoped<IValidator<GetInvoicedOrdersByDateRangeQuery>, GetInvoicedOrdersByDateRangeQueryValidator>();
builder.Services.AddScoped<IValidator<GetInvoicedOrdersByCustomerQuery>, GetInvoicedOrdersByCustomerQueryValidator>();
builder.Services.AddScoped<IValidator<UpdateInvoicedItemPriceCommand>, UpdateInvoicedItemPriceCommandValidator>();

builder.Services.AddScoped<OrderMissingReportedCommandValidator>();
builder.Services.AddScoped<AddPackaingCommandValidator>();
builder.Services.AddScoped<RejectOrderCommandValidator>();
builder.Services.AddScoped<MarkItemIsReadyCommandValidator>();
builder.Services.AddScoped<UnmarkItemReadyValidator>();
builder.Services.AddScoped<SetItemUnitPricesCommandValidator>();

// Add HostedService RabbitConsumer
builder.Services.AddHostedService<OrderIssuedConsumer>();
builder.Services.AddHostedService<OrderReissuedConsumer>();
builder.Services.AddHostedService<OrderDeletedConsumer>();
builder.Services.AddHostedService<OrderCanceledConsumer>();

builder.Services.AddHostedService<OrderVerifiedConsumer>();
builder.Services.AddHostedService<OrderOnTheWayConsumer>();
builder.Services.AddHostedService<OrderDeliveredConsumer>();
builder.Services.AddHostedService<OrderDeliveryIncidentConsumer>();
builder.Services.AddHostedService<DepotService.Infraestructure.Messaging.Consumers.LogisticConsumers.OrderAssignedDeliveryConsumer>();
builder.Services.AddHostedService<OrderResolveIncidentConsumer>();

// Add Export Document Service 
builder.Services.AddScoped<IInvoiceDocumentGenerator, InvoicePdfGenerator>();
builder.Services.AddScoped<InvoicePdfGenerator>();
builder.Services.AddScoped<InvoiceWordGenerator>();
builder.Services.AddScoped<InvoiceExcelGenerator>();

// Obtener la cadena de conexión del appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Registrar los repositorios
builder.Services.AddScoped<ITeamRepository, TeamRepository>();
builder.Services.AddScoped<IDepotOrderRepository, DepotOrderRepository>();
builder.Services.AddScoped<IDepotReportRepository, DepotReportRepository>();

// Registrar el servicio de identidad para consultar los operadores
builder.Services.AddScoped<IIdentityServiceClient, IdentityServiceClient>();
builder.Services.AddHttpContextAccessor(); // Necesario para acceder al contexto HTTP

// Registrar el servicio de correo electrónico
builder.Services.AddScoped<IEmailService, MailgunEmailService>();

// Registrar el servicio de mensajería RabbitMQ
builder.Services.AddScoped<IRabbitMQPublisher, RabbitMQPublisher>();

// Registrar el DbContext
builder.Services.AddDbContext<DepotDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
    b => b.MigrationsAssembly("DepotService.Infraestructure")));

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
    .AddPolicy("DepotAcces", policy =>
        policy.RequireClaim("role", "DepotManager, DepotOperator, BillingManager"));

// Creamos un Http Client IdentityService para consultar los usuarios con role SalesStaff
builder.Services.AddHttpClient("IdentityService", client =>
{
    client.BaseAddress = new Uri("http://identityservice:8080/api/auth/");
});

var app = builder.Build();

// Migrar automaticamente, cada vez que levante el servicio.
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<DepotDbContext>();
    dbContext.Database.Migrate();
}

if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Depot Service API V1");
        c.RoutePrefix = string.Empty; // opcional: Swagger se verá en la raíz
    });
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//se la tuvo que comentar para acceder a la aplicacion movil momentaneamente 
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
