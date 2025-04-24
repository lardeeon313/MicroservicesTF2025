using IdentityService.Application.Services.Interfaces;
using IdentityService.Application.Services;
using IdentityService.Domain.Entities;
using IdentityService.Infraestructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text;
using Microsoft.OpenApi.Models;
using FluentValidation;
using FluentValidation.AspNetCore;
using IdentityService.Application.Validators;
using IdentityService.Application.Interfaces;
using IdentityService.Application.Commands.Register;
using IdentityService.Application.DTOs;
using IdentityService.Application.Commands.Login;

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

// JWT Oauth
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];

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

// Obtener la cadena de conexión del appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Registrar el DbContext
builder.Services.AddDbContext<IdentityDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
        b => b.MigrationsAssembly("IdentityService.Infraestructure")));


// Se registra los Command Handlers
builder.Services.AddScoped<IRegisterCommandHandler, RegisterCommandHandler>();
builder.Services.AddScoped<ILoginCommandHandler, LoginCommandHandler>();


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

app.Run();
