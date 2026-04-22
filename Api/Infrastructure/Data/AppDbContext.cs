using Api.Domain.Entities;
using Api.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace Api.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<SupportTicket> SupportTickets { get; set; }
        public DbSet<Route> Routes { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<TravelHistory> TravelHistories { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<ObstacleReport> ObstacleReports { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

            ConfigureValueObjects(modelBuilder);

            ConfigureRelationships(modelBuilder);
        }

        private void ConfigureValueObjects(ModelBuilder modelBuilder)
        {
            modelBuilder.Owned<UrlImagen>();
            modelBuilder.Owned<PlaceName>();
            modelBuilder.Owned<ExpirationDate>();
            modelBuilder.Owned<RecoveryCode>();
            modelBuilder.Owned<Rating>();
            modelBuilder.Owned<IpAddress>();
            modelBuilder.Owned<RouteName>();
            modelBuilder.Owned<PermissionName>();
            modelBuilder.Owned<Email>();
            modelBuilder.Owned<PhoneNumber>();
            modelBuilder.Owned<TicketSubject>();
            modelBuilder.Owned<Password>();

            modelBuilder.Entity<User>().OwnsOne(u => u.Password, p =>
            {
                p.Property(x => x.Value).HasColumnName("Password").IsRequired();
            });

            modelBuilder.Entity<Route>().OwnsOne(x => x.Path);
            modelBuilder.Entity<ObstacleReport>().OwnsOne(x => x.Location);
            modelBuilder.Entity<PointOfInterest>().OwnsOne(x => x.Location);
            modelBuilder.Entity<TravelHistory>().OwnsOne(x => x.TimeRange);
        }

        private void ConfigureRelationships(ModelBuilder modelBuilder)
        {
            RelationshipConfiguration.Map(modelBuilder);
        }
    }
}