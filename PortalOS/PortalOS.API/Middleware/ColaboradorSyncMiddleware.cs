using PortalOS.Domain.Services;
using System.Security.Claims;

namespace PortalOS.API.Middleware
{
    public class ColaboradorSyncMiddleware
    {
        private readonly RequestDelegate _next;

        public ColaboradorSyncMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, ColaboradorService colaboradorService)
        {
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var userIdClaim = context.User.FindFirstValue("user_id");
                var nome = context.User.FindFirstValue("name");
                var email = context.User.FindFirstValue("email");

                if (long.TryParse(userIdClaim, out var userId) && !string.IsNullOrEmpty(nome) && !string.IsNullOrEmpty(email))
                {
                    colaboradorService.GetOrCreate(userId, nome, email);
                }
            }

            await _next(context);
        }
    }

    public static class ColaboradorSyncMiddlewareExtensions
    {
        public static IApplicationBuilder UseColaboradorSync(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ColaboradorSyncMiddleware>();
        }
    }
}
