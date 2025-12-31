using dNET.API.Authentication;
using dNET.IoC;
using Microsoft.AspNetCore.Authentication;
using Microsoft.OpenApi.Models;
using PortalOS.Domain.Services;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

var domainAssembly = Assembly.GetAssembly(typeof(PortalOS.Domain.Entities.Cliente))!;
var infrastructureAssembly = Assembly.Load("PortalOS.Infrastructure");

var resourcesPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "PortalOS.Infrastructure", "Resources");

builder.Services
    .AddFrameworkNHibernate(
        builder.Configuration,
        infrastructureAssembly,
        domainAssembly)
    .RunMigrations(builder.Configuration, "public", infrastructureAssembly)
    .AddServicesFromAssembly(domainAssembly);

builder.Services.AddScoped<DashboardService>();

builder.Services.AddScoped<IdentityProviderClient>();
builder.Services.AddScoped<DynamicJwtValidator>();

builder.Services.AddAuthentication("DynamicJwtBearer")
    .AddScheme<AuthenticationSchemeOptions, DynamicJwtBearerHandler>("DynamicJwtBearer", null);

builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "PortalOS API",
        Version = "v1"
    });
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseMultiTenant();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
