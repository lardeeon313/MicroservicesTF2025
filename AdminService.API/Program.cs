using AdminService.Application.Commands.Employees.ChangeStatusEmployee;
using AdminService.Application.Commands.Employees.RegisterEmployee;
using AdminService.Application.Commands.Employees.UpdateEmployee;
using AdminService.Application.Queries.Employee.GetAllEmployees;
using AdminService.Application.Queries.Employees.GetEmployeeById;
using AdminService.Application.Queries.Employees.GetEmployeesBySector;
using AdminService.Application.Queries.Employees.GetEmployeesByStatus;
using AdminService.Application.Services;
using AdminService.Application.Services.DepotService;
using AdminService.Application.Services.IdentityService;
using AdminService.Application.Services.LogisticService;
using AdminService.Application.Services.SalesService;
using AdminService.Domain.IRepositories;
using AdminService.Infraestructure.Messaging.Consumers;
using AdminService.Infraestructure.Messaging.Publishers;
using AdminService.Infraestructure.Persistence;
using AdminService.Infraestructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text;




var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    EnvironmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddHttpClient();

// Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
});

// Register RabbitMQ Publisher
builder.Services.AddScoped<IRabbitMQPublisher, RabbitMQPublisher>();

// Register Consumers RabbitMQ
builder.Services.AddHostedService<UserRegisteredConsumer>();

// Register Services
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<IDepotServiceClient, DepotServiceClient>();
builder.Services.AddScoped<IIdentityServiceClient, IdentityServiceClient>();
builder.Services.AddScoped<ISalesServiceClient, SalesServiceClient>();
builder.Services.AddScoped<ILogisticServiceClient, LogisticServiceClient>();

// Registrar Commandos y Queries de los empleados
builder.Services.AddScoped<IRegisterEmployeeCommandHandler, RegisterEmployeeCommandHandler>();
builder.Services.AddScoped<IUpdateEmployeeCommandHandler, UpdateEmployeeCommandHandler>();
builder.Services.AddScoped<IChangeStatusEmployeeCommandHandler, ChangeStatusEmployeeCommandHandler>();
builder.Services.AddScoped<IGetAllEmployeesQueryHandler, GetAllEmployeesQueryHandler>();
builder.Services.AddScoped<IGetEmployeeByIdQueryHandler, GetEmployeeByIdQueryHandler>();
builder.Services.AddScoped<IGetEmployeesByStatusQueryHandler, GetEmployeesByStatusQueryHandler>();
builder.Services.AddScoped<IGetEmployeesBySectorQueryHandler, GetEmployeesBySectorQueryHandler>();

// Obtener las variables de configuración
var connectionString = builder.Configuration["ConnectionStrings:DefaultConnection"];
var rabbitHost = builder.Configuration["RabbitMQ:Host"];
var rabbitPort = builder.Configuration["RabbitMQ:Port"];
var rabbitUser = builder.Configuration["RabbitMQ:Username"];
var rabbitPass = builder.Configuration["RabbitMQ:Password"];
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var mailApi = builder.Configuration["MailSettings:ApiKey"];

// Register the DbContext
builder.Services.AddDbContext<AdminDbContext>(options =>
    options.UseMySql(connectionString,
        ServerVersion.AutoDetect(connectionString),
        b => b.MigrationsAssembly("AdminService.API")));

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
    .AddPolicy("AdminOnly", policy =>
        policy.RequireClaim("role", "Admin"));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AdminDbContext>();
    dbContext.Database.Migrate();
}

if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Admin Service API V1");
        c.RoutePrefix = string.Empty; // opcional: Swagger se verá en la raíz
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
