using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SalesService.Infraestructure;
using SalesService.Infraestructure.Messaging.Publisher;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Persistence.Repositories;
using System.Reflection;
using SalesService.Application.Commands.Handlers;
using SalesService.Application.Commands.Customers.Delete;

using SalesService.Application.Commands.Handlers.Interfaces;
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

var builder = WebApplication.CreateBuilder(args);

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
        Title = "Sales Service API",    
        Version = "v1",
        Description = "The microservice is responsible for capturing sales and issuing orders.",
        Contact = new OpenApiContact
        {
            Name = "Milton Argüello, Bustos Santiago, Diego Aguirre"
        }
    });
});

// Add FluentValidation
builder.Services.AddScoped<IValidator<RegisterCustomerRequest>, RegisterCustomerValidator>();
builder.Services.AddScoped<IValidator<UpdateCustomerRequest>, UpdateCustomerValidator>();

// Add services Command Handlers
builder.Services.AddScoped<ICustomerDeleteCommandHandler, CustomerDeleteCommandHandler>();
builder.Services.AddScoped<ICustomerUpdateCommandHandler, CustomerUpdateCommandHandler>();
builder.Services.AddScoped<ICustomerRegisterCommandHandler, CustomerRegisterCommandHandler>();
builder.Services.AddScoped<IGetAllCustomersQueryHandler, GetAllCustomersQueryHandler>();
builder.Services.AddScoped<IGetCustomerByIdQueryHandler, GetCustomerByIdQueryHandler>();
builder.Services.AddScoped<IGetCustomerByEmailQueryHandler, GetCustomerByEmailQueryHandler>();

builder.Services.AddScoped<ICreateDummyCommandHandler, CreateDummyCommandHandler>();

// Add services Repository and DbContext
builder.Services.AddScoped<IDummyRepository, DummyRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();

// Add RabbitMQ
builder.Services.AddScoped<IRabbitMQPublisher, RabbitMQPublisher>();

// Obtener la cadena de conexión del appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Registrar el DbContext
builder.Services.AddDbContext<SalesDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
        b => b.MigrationsAssembly("SalesService.API")));

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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
