using Api.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Infrastructure.Data.Configurations
{
    public class RouteConfiguration : IEntityTypeConfiguration<Route>
    {
        public void Configure(EntityTypeBuilder<Route> builder)
        {
            builder.HasKey(r => r.Id);

            builder.OwnsOne(r => r.Name, n =>
            {
                n.Property(x => x.Value)
                 .HasColumnName("Name")
                 .IsRequired();
            });

            builder.OwnsOne(r => r.Path, path =>
            {
                path.Property(p => p.SerializedPoints)
                    .HasColumnName("Points") 
                    .IsRequired();
            });

            builder.OwnsOne(r => r.DistanceKm, d =>
            {
                d.Property(x => x.Value).HasColumnName("DistanceKm").IsRequired();
            });

            builder.OwnsOne(r => r.EstimatedTime, t =>
            {
                t.Property(x => x.Value).HasColumnName("EstimatedTime").IsRequired();
            });

            builder.Property(r => r.CreatedBy).IsRequired();
            builder.Property(r => r.CreatedAt).IsRequired();
        }
    }
}