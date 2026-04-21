using Api.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Infrastructure.Data.Configurations
{
    public class TravelHistoryConfiguration : IEntityTypeConfiguration<TravelHistory>
    {
        public void Configure(EntityTypeBuilder<TravelHistory> builder)
        {
            builder.HasKey(x => x.Id);

            builder.OwnsOne(x => x.CO2SavedKg, c =>
            {
                c.Property(p => p.Value)
                 .HasColumnName("CO2SavedKg")
                 .IsRequired();
            });

            builder.OwnsOne(x => x.TimeRange, t =>
            {
                t.Property(p => p.Start)
                 .HasColumnName("StartTime")
                 .IsRequired();

                t.Property(p => p.End)
                 .HasColumnName("EndTime")
                 .IsRequired();
            });
        }
    }
}