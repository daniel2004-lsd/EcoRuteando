using Api.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Infrastructure.Data.Configurations
{
    public class ObstacleReportConfiguration : IEntityTypeConfiguration<ObstacleReport>
    {
        public void Configure(EntityTypeBuilder<ObstacleReport> builder)
        {
            builder.HasKey(x => x.Id);

            builder.OwnsOne(x => x.Location, loc =>
            {
                loc.Property(c => c.Latitude)
                   .HasColumnName("Latitude")
                   .IsRequired();

                loc.Property(c => c.Longitude)
                   .HasColumnName("Longitude")
                   .IsRequired();
            });

            builder.Property(x => x.Type)
                   .HasColumnName("Type")
                   .IsRequired();

            builder.Property(x => x.Description)
                   .HasColumnName("Description")
                   .IsRequired();

            builder.Property(x => x.CreatedAt)
                   .HasColumnName("CreatedAt")
                   .IsRequired();
        }
    }
}