using Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Api.Infrastructure.Data
{
    public static class RelationshipConfiguration
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            

            modelBuilder.Entity<Session>()
                .HasOne(s => s.User)
                .WithMany(u => u.Sessions)
                .HasForeignKey(s => s.UserId)
                .IsRequired();

            modelBuilder.Entity<Profile>()
                .HasOne(p => p.Session)
                .WithOne() 
                .HasForeignKey<Profile>(p => p.SessionId)
                .IsRequired();

            modelBuilder.Entity<Profile>()
                .HasOne(p => p.Configuration)
                .WithOne()
                .HasForeignKey<Profile>(p => p.ConfigurationId)
                .IsRequired();

            modelBuilder.Entity<RolePermission>()
                .HasKey(rp => new { rp.RoleId, rp.PermissionId });

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermission)
                .HasForeignKey(rp => rp.RoleId);

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Permission)
                .WithMany(p => p.RolePermission)
                .HasForeignKey(rp => rp.PermissionId);

            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.RoleId, ur.UserId });

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRole)
                .HasForeignKey(ur => ur.RoleId);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRole)
                .HasForeignKey(ur => ur.UserId);


            modelBuilder.Entity<Route>()
                .HasOne(r => r.Profile)
                .WithMany()
                .HasForeignKey(r => r.Id) 
                .IsRequired();

            modelBuilder.Entity<TravelHistory>(entity =>
            {
                entity.HasOne(th => th.Profile)
                      .WithMany()
                      .HasForeignKey(th => th.ProfileId)
                      .IsRequired();

                entity.HasOne(th => th.Route)
                      .WithMany()
                      .HasForeignKey(th => th.RouteId)
                      .IsRequired();
            });

            modelBuilder.Entity<PointOfInterest>()
                .HasOne(p => p.Profile)
                .WithMany()
                .HasForeignKey(p => p.Id)
                .IsRequired();

            modelBuilder.Entity<ObstacleReport>()
                .HasOne(o => o.Profile)
                .WithMany()
                .HasForeignKey(o => o.ProfileId)
                .IsRequired();

            modelBuilder.Entity<ReportValidation>()
                .HasKey(rv => new { rv.ProfileId, rv.ReportId });

            modelBuilder.Entity<ReportValidation>()
                .HasOne(rv => rv.Profile)
                .WithMany()
                .HasForeignKey(rv => rv.ProfileId);

            modelBuilder.Entity<ReportValidation>()
                .HasOne(rv => rv.ObstacleReport)
                .WithMany()
                .HasForeignKey(rv => rv.ReportId);

            modelBuilder.Entity<RouteReview>()
                .HasOne(rr => rr.Profile)
                .WithMany()
                .HasForeignKey(rr => rr.ProfileId)
                .IsRequired();

            modelBuilder.Entity<RouteReview>()
                .HasOne(rr => rr.Route)
                .WithMany()
                .HasForeignKey(rr => rr.RouteId)
                .IsRequired();


            modelBuilder.Entity<SupportTicket>()
                .HasOne(st => st.Profile)
                .WithMany()
                .HasForeignKey(st => st.ProfileId)
                .IsRequired();


            modelBuilder.Entity<AuditLog>()
                .HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId);

            modelBuilder.Entity<PasswordRecovery>()
                .HasOne(pr => pr.User)
                .WithMany()
                .HasForeignKey(pr => pr.UserId)
                .IsRequired();
        }
    }
}