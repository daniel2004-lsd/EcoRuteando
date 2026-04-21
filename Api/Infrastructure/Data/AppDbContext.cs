using Api.Domain;
using Api.Domain.Entity;
using Api.Domain.Entity.ValueObjects;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Text.Json;

namespace Api.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<SupportTicket> SupportTickets { get; set; }
        public DbSet<ReportValidation> ReportValidations { get; set; }
        public DbSet<Route> Routes { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<RolePermission> RolePermission { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<TravelHistory> TravelHistories { get; set; }
        public DbSet<Configuration> Configurations { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<PointOfInterest> PointsOfInterest { get; set; }
        public DbSet<PasswordRecovery> PasswordRecoveries { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<ObstacleReport> ObstacleReports { get; set; }
        public DbSet<RouteReview> RouteReviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

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

            modelBuilder.Entity<Profile>(b =>
            {
                b.OwnsOne(p => p.PhoneNumber, pn =>
                {
                    pn.Property(v => v.Value).HasColumnName("PhoneNumber").IsRequired().HasMaxLength(15);
                });

                b.OwnsOne(p => p.ProfilePicture, pp =>
                {
                    pp.Property(v => v.Value).HasColumnName("ProfilePicture").IsRequired();
                });
            });

            modelBuilder.Entity<Route>().OwnsOne(x => x.Path);
            modelBuilder.Entity<ObstacleReport>().OwnsOne(x => x.Location);
            modelBuilder.Entity<PointOfInterest>().OwnsOne(x => x.Location);
            modelBuilder.Entity<TravelHistory>().OwnsOne(x => x.TimeRange);
        }
    }
}