using Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Infrastructure.Data.Configurations
{
    public class PointOfInterestConfiguration : IEntityTypeConfiguration<PointOfInterest>
    {
        public void Configure(EntityTypeBuilder<PointOfInterest> builder)
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
        }
    }
}