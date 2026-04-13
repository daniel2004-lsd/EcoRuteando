using Api.Domain;
using Api.Domain.Entity;
using Microsoft.EntityFrameworkCore;  

namespace Api.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Sesion> Sesiones { get; set; }
        public DbSet<TicketSoporte> Tickets { get; set; }
        public DbSet<ValidacionReporte> Validaciones { get; set; }
        public DbSet<Ruta> Rutas { get; set; }

        public DbSet<Permiso> permisos { get; set; }
        public DbSet<Rol> roles { get; set; }
        public DbSet<PermisoRol> PermisoRol { get; set; }
        public DbSet<RolUsuario> RolUsuario { get; set; }
        public DbSet<HistorialViajes> Bitacoras { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}