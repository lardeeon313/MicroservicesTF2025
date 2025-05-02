using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SalesService.Infrastructure.Persistence;
using System.Reflection;
using SalesService.Application.Handlers;
using SalesService.Infraestructure.Messaging.Publisher;
using SalesService.Domain.IRepositories;
using SalesService.Domain.Entities;
using SalesService.Application.Commands.Handlers.Customer;
using SalesService.Application.Commands.Handlers.Orders;

var builder = WebApplication.CreateBuilder(args);

// Add controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
});

// Obtener la cadena de conexión del appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// DbContext
builder.Services.AddDbContext<SalesDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Autenticación y Autorización
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.Authority = "http://identityservice:8080";
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false
        };
    });

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("SalesOnly", policy => policy.RequireRole("SalesStaff"));

// Repositorios
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// RabbitMQ
builder.Services.AddScoped<IRabbitMQPublisher, RabbitMQPublisher>();

// Handlers - Commands
builder.Services.AddScoped<CreateOrderHandler>();
builder.Services.AddScoped<UpdateOrderHandler>();
builder.Services.AddScoped<CancelOrderHandler>();
builder.Services.AddScoped<AttachReceiptHandler>();
builder.Services.AddScoped<RegisterCustomerHandler>();

// Handlers - Queries
builder.Services.AddScoped<GetOrdersHandler>();
builder.Services.AddScoped<GetOrderDetailHandler>();
builder.Services.AddScoped<GetCustomerByEmailHandler>();

// Validaciones (si se usan explícitamente)
//builder.Services.AddScoped<CreateOrderValidator>();//

// Migrar automáticamente la base de datos
using (var scope = builder.Services.BuildServiceProvider().CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<SalesDbContext>();
    dbContext.Database.Migrate();
}

// Swagger UI
if (builder.Environment.IsDevelopment() || builder.Environment.IsProduction())
{
    builder.Services.AddSwaggerGen();
}

// Replace the problematic code block with the following:

// Migrar automáticamente la base de datos
var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sales Service API V1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

// Ensure that OrderRepository implements IOrderRepository  
internal class OrderRepository : IOrderRepository
{
    // Implementation of IOrderRepository methods and properties  
    public Task AddAsync(Order order)
    {
        throw new NotImplementedException();
    }
}

// Ensure that CustomerRepository implements ICustomerRepository  
internal class CustomerRepository : ICustomerRepository
{
    // Implementation of ICustomerRepository methods and properties  
    public Task AddAsync(Customer customer)
    {
        throw new NotImplementedException();
    }
}