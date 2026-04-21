using Api.Infrastructure.Data;
using Api.Domain.Interface;
using Api.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Api.Application.Service;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ISessionRepository, SessionRepository>();
builder.Services.AddScoped<SessionService>();
builder.Services.AddScoped<IPermissionRepository, PermissionRepository>();
builder.Services.AddScoped<PermissionService>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<RoleService>();
builder.Services.AddScoped<IPermissionRoleRepository, PermissionRoleRepository>();
builder.Services.AddScoped<RolePermissionService>();
builder.Services.AddScoped<IUserRoleRepository, UserRoleRepository>();
builder.Services.AddScoped<UserRoleService>();
builder.Services.AddScoped<IProfileRepository, ProfileRepository>();
builder.Services.AddScoped<ProfileService>();
builder.Services.AddScoped<IConfigurationRepository, ConfigurationRepository>();
builder.Services.AddScoped<ConfigurationService>();
builder.Services.AddScoped<IPasswordRecoveryRepository, PasswordRecoveryRepository>();
builder.Services.AddScoped<PasswordRecoveryService>();
builder.Services.AddScoped<ISupportTicketRepository, SupportTicketRepository>();
builder.Services.AddScoped<SupportTicketService>();
builder.Services.AddScoped<IReportValidationRepository, ReportValidationRepository>();
builder.Services.AddScoped<ReportValidationService>();
builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();
builder.Services.AddScoped<AuditLogService>();
builder.Services.AddScoped<IObstacleReportRepository, ObstacleReportRepository>();
builder.Services.AddScoped<ObstacleReportService>();
builder.Services.AddScoped<IRouteRepository, RouteRepository>();
builder.Services.AddScoped<RouteService>();
builder.Services.AddScoped<IRouteReviewRepository, RouteReviewRepository>();
builder.Services.AddScoped<RouteReviewService>();
builder.Services.AddScoped<IPointOfInterestRepository, PointOfInterestRepository>();
builder.Services.AddScoped<PointOfInterestService>();
builder.Services.AddScoped<ITravelHistoryRepository, TravelHistoryRepository>();
builder.Services.AddScoped<TravelHistoryService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowAll");

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("./swagger/v1/swagger.json", "Api v1");
    c.RoutePrefix = string.Empty;
});

app.MapControllers();

app.Run();