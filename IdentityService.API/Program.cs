using IdentityService.Application.Services.Interfaces;
using IdentityService.Application.Services;
using IdentityService.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Net;
using System.Text;
using Microsoft.OpenApi.Models;
using FluentValidation;
using FluentValidation.AspNetCore;
using IdentityService.Application.Validators;
using IdentityService.Application.Interfaces;
using IdentityService.Application.Commands.Register;
using IdentityService.Application.DTOs;
using IdentityService.Application.Commands.Login;
using IdentityService.Application.Queries.GetAllOperators;
using IdentityService.Application.Queries.GetAllSalesStaffs;
using IdentityService.Application.Queries.GetCurrentUser;
using IdentityService.Application.Queries.GetAllDeliverys;
using IdentityService.Infraestructure.Messaging.Publisher;
using IdentityService.Infraestructure.Messaging.Consumer;
using IdentityService.Infraestructure;
using IdentityService.Application.Commands.Employees.CreateNewPassword;
using IdentityService.Application.Commands.Employees.ChangeEmployedStatus;
using IdentityService.Application.Commands.Employees.SetMustCreatePassword;
using IdentityService.Infraestructure.EmailTemplates;
using IdentityService.Domain.Common.Interfaces;
using IdentityService.Application.Commands.Employees.ForgotPassword;
using IdentityService.Application.Commands.Employees.ResetPassword;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    EnvironmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"
});
//para acceder desde el celular
//builder.WebHost.UseUrls("http://0.0.0.0:5006");

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
        Title = "Identity Service API",
        Version = "v1",
        Description = "Microservice responsible for user identity, authentication, and role-based acces",
        Contact = new OpenApiContact
        {
            Name = "Milton Argüello, Bustos Santiago, Diego Aguirre"
        }
    });
});


// Se registra la dependencia del TokenService
builder.Services.AddScoped<ITokenService, TokenService>();

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<IdentityDbContext>()
    .AddDefaultTokenProviders();

// Obtener las variables de configuración
var connectionString = builder.Configuration["ConnectionStrings:DefaultConnection"];
var rabbitHost = builder.Configuration["RabbitMQ:Host"];
var rabbitPort = builder.Configuration["RabbitMQ:Port"];
var rabbitUser = builder.Configuration["RabbitMQ:Username"];
var rabbitPass = builder.Configuration["RabbitMQ:Password"];
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var mailApi = builder.Configuration["MailSettings:ApiKey"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "JwtBearer";
    options.DefaultChallengeScheme = "JwtBearer";
})
.AddJwtBearer("JwtBearer", options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey ?? ""))
    };
});

// FluentValidation
builder.Services.AddScoped<IValidator<RegisterRequest>, RegisterRequestValidator>();
builder.Services.AddScoped<IValidator<LoginRequest>, LoginRequestValidator>();

// Registrar el DbContext
builder.Services.AddDbContext<IdentityDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
        b => b.MigrationsAssembly("IdentityService.Infraestructure")));


// Se registra los Command Handlers
builder.Services.AddScoped<IRegisterCommandHandler, RegisterCommandHandler>();
builder.Services.AddScoped<ILoginCommandHandler, LoginCommandHandler>();
builder.Services.AddScoped<ICreateNewPasswordCommandHandler, CreateNewPasswordCommandHandler>();
builder.Services.AddScoped<IChangeEmployedStatusCommandHandler, ChangeEmployedStatusCommandHandler>();
builder.Services.AddScoped<ISetMustCreatePasswordCommandHandler, SetMustCreatePasswordCommandHandler>();
builder.Services.AddScoped<IForgotPasswordCommandHandler, ForgotPasswordCommandHandler>();
builder.Services.AddScoped<IResetPasswordCommandHandler , ResetPasswordCommandHandler>();
builder.Services.AddScoped<IGetAllOperatorsQueryHandler,  GetAllOperatorsQueryHandler>();
builder.Services.AddScoped<IGetAllSalesStaffsQueryHandler, GetAllSalesStaffsQueryHandler>();
builder.Services.AddScoped<IGetCurrentUserQueryHandler, GetCurrentUserQueryHandler>(); 
builder.Services.AddScoped<IGetAllDeliverysQueryHandler, GetAllDeliverysQueryHandler>();

// Registrar el servicio de Mensajeria RabbitMQ
builder.Services.AddScoped<IRabbitMQPublisher, RabbitMQPublisher>();

// Add EmailService
builder.Services.AddScoped<IEmailService, MailgunEmailService>();

// Registrar los Consumers de RabbitMQ
builder.Services.AddHostedService<EmployeeUpdatedConsumer>();
builder.Services.AddHostedService<EmployeeRegisteredConsumer>();

var app = builder.Build();

// Migrar automaticamente, cada vez que levante el servicio.
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<IdentityDbContext>();
    dbContext.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Identity Service API V1");
        c.RoutePrefix = string.Empty; // opcional: Swagger se verá en la raíz
    });
}

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

// Endpoint para obtener la IP local del servidor
app.MapGet("/local-ip", () =>
{
    var host = Dns.GetHostEntry(Dns.GetHostName());
    var ip = host.AddressList.FirstOrDefault(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork);
    return Results.Json(new { ip = ip?.ToString() ?? "127.0.0.1" });
});



app.Run();
