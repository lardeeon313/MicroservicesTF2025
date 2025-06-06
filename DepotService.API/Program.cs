using DepotService.Application.Commands.DepotManager.AssignOperator;
using DepotService.Application.Commands.DepotManager.AssignOrder;
using DepotService.Application.Commands.DepotManager.CreateTeam;
using DepotService.Application.Commands.DepotManager.DeleteTeam;
using DepotService.Application.Commands.DepotManager.RemoveOperatorToTeam;
using DepotService.Application.Commands.DepotManager.UpdateTeam;
using DepotService.Application.DTOs.DepotManager.Request;
using DepotService.Application.Queries.DepotManager.GetAllTeams;
using DepotService.Application.Queries.DepotManager.GetTeamById;
using DepotService.Application.Queries.DepotManager.GetTeamByName;
using DepotService.Application.Validators.DepotManager;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using DepotService.Infraestructure.Messaging;
using DepotService.Infraestructure.Messaging.Consumers;
using DepotService.Infraestructure.Persistence.Repositories;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;

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
        Title = "Depot Service API",
        Version = "v1",
        Description = "The microservice is responsible for capturing orders and working for it.",
        Contact = new OpenApiContact
        {
            Name = "Milton Argüello, Bustos Santiago, Diego Aguirre"
        }
    });
});

// Add Commands and Queries
builder.Services.AddScoped<IGetAllTeamsQueryHandler,  GetAllTeamsQueryHandler>();
builder.Services.AddScoped<IGetTeamByNameQueryHandler, GetTeamByNameQueryHandler>();
builder.Services.AddScoped<IGetTeamByIdQueryHandler,  GetTeamByIdQueryHandler>();

builder.Services.AddScoped<IAssignOperatorCommandHandler, AssignOperatorCommandHandler>();
builder.Services.AddScoped<IAssignOrderCommandHandler,  AssignOrderCommandHandler>();
builder.Services.AddScoped<ICreateTeamCommandHandler,  CreateTeamCommandHandler>();
builder.Services.AddScoped<IDeleteTeamCommandHandler,  DeleteTeamCommandHandler>();
builder.Services.AddScoped<IUpdateTeamCommandHandler,  UpdateTeamCommandHandler>();
builder.Services.AddScoped<IRemoveOperatorCommandHandler, RemoveOperatorCommandHandler>();

// Add FluentValidation
builder.Services.AddScoped<IValidator<AssignOperatorRequest>, AssignOperatorCommandValidator>();
builder.Services.AddScoped<IValidator<CreateTeamRequest>, CreateTeamCommandValidator>();
builder.Services.AddScoped<IValidator<UpdateTeamRequest>, UpdateTeamCommandValidator>();
builder.Services.AddScoped<IValidator<AssignOrderRequest>, AssignOrderCommandValidator>();



// Add HostedService RabbitConsumer
builder.Services.AddHostedService<DummyCreatedConsumer>();
builder.Services.AddHostedService<OrderIssuedConsumer>();

// Obtener la cadena de conexión del appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Registrar los repositorios
builder.Services.AddScoped<ITeamRepository, TeamRepository>();
builder.Services.AddScoped<IDepotOrderRepository, DepotOrderRepository>();


// Registrar el DbContext
builder.Services.AddDbContext<DepotDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
    b => b.MigrationsAssembly("DepotService.API")));

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

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
