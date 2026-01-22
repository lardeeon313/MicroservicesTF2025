using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SalesService.Infraestructure;
using SalesService.Infraestructure.Messaging.Publisher;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Persistence.Repositories;
using System.Reflection;
using SalesService.Application.Commands.Customers.Delete;

using SalesService.Application.Validators.Customer;
using FluentValidation;
using SalesService.Application.DTOs.Customer;
using Microsoft.OpenApi.Models;
using SalesService.Application.Queries.Customers.GetCustomerByEmail;
using Microsoft.Extensions.DependencyInjection;
using SalesService.Application.Commands.Customers.Update;
using SalesService.Application.Commands.Customers.Register;
using SalesService.Application.Queries.Customers.GetAllCustomers;
using SalesService.Application.Queries.Customers.GetCustomer;
using SalesService.API.Middleware;
using SalesService.Application.Validators.Order;
using SalesService.Application.DTOs.Order.Request;
using SalesService.Application.Commands.Orders.Register;
using SalesService.Application.Commands.Orders.Update;
using SalesService.Application.Commands.Orders.Cancel;
using SalesService.Application.Commands.Orders.Delete;
using SalesService.Application.Queries.Orders.GetById;
using SalesService.Application.Queries.Orders.GetByStatus;
using SalesService.Application.Queries.Orders.GetByIdCustomer;
using SalesService.Application.Queries.Orders.GetAll;
using System.Text.Json.Serialization;
using System.Text.Json;
using SalesService.Application.Commands.Orders.UpdateStatus;
using SalesService.Application.Queries.Orders.GetPagedOrders;
using SalesService.Application.Queries.Customers.GetPagedCustomers;
using SalesService.Infraestructure.Services;
using System.Security.Claims;
using System.Text;
using SalesService.Application.Services.IdentityServiceClient;
using SalesService.Domain.Common.Interfaces;
using SalesService.Infraestructure.Email;
using SalesService.Application.Commands.Orders.OrderReissued;
using SalesService.Application.Commands.Orders.UpdateMissingOrder;
using SalesService.Application.Queries.Orders.GetAllMissingOrders;
using SalesService.Application.Commands.Customers.ActivateCustomer;
using SalesService.Application.Commands.Customers;
using SalesService.Application.Queries.Customers.GetCustomerAddresses;
using SalesService.Application.Queries.Customers.GetCustomerPaymentTypes;
using SalesService.Infraestructure.Messaging.Consumer.DepotConsumers;
using SalesService.Infraestructure.Messaging.Consumer.LogisticConsumers;
using SalesService.Application.Queries.Reports.CustomerReport;
using SalesService.Application.Queries.Reports.CustomerSatisfactionReport;
using SalesService.Application.Queries.Reports.CustomerInactiveReport;
using SalesService.Application.Queries.Reports.ModifiedCanceledOrders;
using SalesService.Application.Queries.Reports.GetSalesPerfomanceReport;
using SalesService.Application.Queries.Reports.CustomerPaymenTypeReport;
using SalesService.Application.Commands.Orders.CreateOrderSatisfaction;
using SalesService.Application.Queries.Orders.GetOrderForSatisfaction;

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
        Title = "Sales Service API",    
        Version = "v1",
        Description = "The microservice is responsible for capturing sales and issuing orders.",
        Contact = new OpenApiContact
        {
            Name = "Milton Argüello, Bustos Santiago, Diego Aguirre"
        }
    });
});

// Add Service CustomerStatusUpdater
/*        builder.Services.AddHostedService<CustomerStatusUpdaterService>();      */

// Add FluentValidation
builder.Services.AddScoped<IValidator<RegisterCustomerRequest>, RegisterCustomerValidator>();
builder.Services.AddScoped<IValidator<UpdateCustomerRequest>, UpdateCustomerValidator>();
builder.Services.AddScoped<IValidator<UpdateOrderRequest>, UpdateOrderValidator>();
builder.Services.AddScoped<IValidator<RegisterOrderItemRequest>, RegisterOrderItemValidator>();
builder.Services.AddScoped<IValidator<RegisterOrderRequest>, RegisterOrderValidator>();
builder.Services.AddScoped<IValidator<UpdateOrderStatusRequest>, UpdateOrderStatusValidator>();
builder.Services.AddScoped<IValidator<OrderReissuedRequest>, OrderReissuedValidator>();
builder.Services.AddScoped<IValidator<UpdateOrderMissingRequest>, UpdateOrderMissingValidator>();


// Add services Command Handlers / Customer
builder.Services.AddScoped<ICustomerDeleteCommandHandler, CustomerDeleteCommandHandler>();
builder.Services.AddScoped<ICustomerUpdateCommandHandler, CustomerUpdateCommandHandler>();
builder.Services.AddScoped<ICustomerRegisterCommandHandler, CustomerRegisterCommandHandler>();
builder.Services.AddScoped<IActivateCustomerCommandHandler, ActivateCustomerCommandHandler>();
builder.Services.AddScoped<IDesactivateCustomerCommandHandler, DesactivateCustomerCommandHandler>();
builder.Services.AddScoped<IGetAllCustomersQueryHandler, GetAllCustomersQueryHandler>();
builder.Services.AddScoped<IGetCustomerByIdQueryHandler, GetCustomerByIdQueryHandler>();
builder.Services.AddScoped<IGetCustomerByEmailQueryHandler, GetCustomerByEmailQueryHandler>();
builder.Services.AddScoped<IGetCustomerPaymentTypesQueryHandler, GetCustomerPaymentTypesQueryHandler>();    

// Add services Command Handlers / Order 
builder.Services.AddScoped<IGetPagedCustomersQueryHandler,  GetPagedCustomersQueryHandler>();
builder.Services.AddScoped<IGetPagedOrdersQueryHandler,  GetPagedOrdersQueryHandler>();
builder.Services.AddScoped<IRegisterOrderCommandHandler, RegisterOrderCommandHandler>();
builder.Services.AddScoped<IUpdateOrderCommandHandler, UpdateOrderCommandHandler>();
builder.Services.AddScoped<ICancelOrderCommandHandler, CancelOrderCommandHandler>();
builder.Services.AddScoped<IDeleteOrderCommandHandler, DeleteOrderCommandHandler>();
builder.Services.AddScoped<IUpdateOrderStatusCommandHandler, UpdateOrderStatusCommandHandler>();
builder.Services.AddScoped<IGetOrderByIdQueryHandler, GetOrderByIdQueryHandler>();
builder.Services.AddScoped<IGetOrderByStatusQueryHandler, GetOrderByStatusQueryHandler>();
builder.Services.AddScoped<IGetOrderByIdCustomerQueryHandler, GetOrderByIdCustomerQueryHandler>();
builder.Services.AddScoped<IGetAllOrdersQueryHandler, GetAllOrdersQueryHandler>();
builder.Services.AddScoped<IOrderReissuedCommandHandler, OrderReissuedCommandHandler>();
builder.Services.AddScoped<IUpdateMissingOrderCommandHandler, UpdateMissingOrderCommandHandler>();
builder.Services.AddScoped<IGetAllMissingOrdersQueryHandler, GetAllMissingOrdersQueryHandler>();
builder.Services.AddScoped<IGetCustomerAddressesQueryHandler, GetCustomerAddressesQueryHandler>();
builder.Services.AddScoped<ICreateOrderSatisfactionCommandHandler, CreateOrderSatisfactionCommandHandler>();
builder.Services.AddScoped<IGetOrderForSatisfactionQueryHandler, GetOrderForSatisfactionQueryHandler>();

// Add Services Query Handlers / Reports
builder.Services.AddScoped<IGetCustomerReportQueryHandler, GetCustomerReportQueryHandler>();
builder.Services.AddScoped<IGetCustomerSatisfactionQueryHandler, GetCustomerSatisfactionQueryHandler>();
builder.Services.AddScoped<IGetCustomerInactiveQueryHandler, GetCustomerInactiveQueryHandler>();
builder.Services.AddScoped<IGetModifiedCanceledOrdersQueryHandler , GetModifiedCanceledOrdersQueryHandler>();
builder.Services.AddScoped<IGetSalesPerfomanceReportQueryHandler, GetSalesPerfomanceReportQueryHandler>();
builder.Services.AddScoped<IGetCustomerPaymentTypeQueryHandler, GetCustomerPaymentTypeQueryHandler>();

// Add EmailService
builder.Services.AddScoped<IEmailService, MailgunEmailService>();

// Registramos el servicio encargado para consultar el endpoint en identityService
builder.Services.AddScoped<IIdentityServiceClient, IdentityServiceClient>();
builder.Services.AddHttpContextAccessor(); // Necesario para acceder al contexto HTTP

// Add services Repository and DbContext
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IReportRepository, ReportRepository>();

// Add RabbitMQ
builder.Services.AddScoped<IRabbitMQPublisher, RabbitMQPublisher>();

// Add Consumers
builder.Services.AddHostedService<OrderMissingConsumer>();
builder.Services.AddHostedService<OrderConfirmedConsumer>();
builder.Services.AddHostedService<OrderInPreparationConsumer>();
builder.Services.AddHostedService<OrderInvoicedConsumer>();
builder.Services.AddHostedService<OrderPreparedConsumer>();
builder.Services.AddHostedService<OrderSentToBillingConsumer>();

builder.Services.AddHostedService<OrderVerifiedConsumer>();
builder.Services.AddHostedService<OrderDeliveredConsumer>();
builder.Services.AddHostedService<OrderAssignedDeliveryConsumer>();
builder.Services.AddHostedService<OrderDeliveryIncidentConsumer>();
builder.Services.AddHostedService<OrderOnTheWayConsumer>();
builder.Services.AddHostedService<OrderResolveIncidentConsumer>();

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
builder.Services.AddDbContext<SalesDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
        b => b.MigrationsAssembly("SalesService.Infraestructure")));

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
    .AddPolicy("SalesOnly", policy =>
        policy.RequireClaim("role", "SalesStaff"));

// Creamos un Http Client IdentityService para consultar los usuarios con role SalesStaff
builder.Services.AddHttpClient("IdentityService", client =>
{
    client.BaseAddress = new Uri("http://identityservice:8080/api/auth/");
});

var app = builder.Build();  

// Migrar automaticamente, cada vez que levante el servicio.
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<SalesDbContext>();
    dbContext.Database.Migrate();
}

if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sales Service API V1");
        c.RoutePrefix = string.Empty; // opcional: Swagger se verá en la raíz
    });
}

// Middleware global de excepciones
app.UseMiddleware<ExceptionMiddleware>();

// Seguridad
app.UseAuthentication();
app.UseAuthorization();

// Ruteo
app.MapControllers();

app.Run();
