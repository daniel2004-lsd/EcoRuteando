using Api.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Infrastructure.Data.Configurations
{
    public class SessionConfiguration : IEntityTypeConfiguration<Session>
    {
        public void Configure(EntityTypeBuilder<Session> builder)
        {
            builder.HasKey(x => x.Id);

            builder.OwnsOne(x => x.IpAddress, ip =>
            {
                ip.Property(x => x.Value)
                  .HasColumnName("IpAddress")
                  .IsRequired();
            });

            builder.Property(x => x.StartDate)
                   .HasColumnName("StartDate")
                   .IsRequired();

            builder.OwnsOne(x => x.EndDate, end =>
            {
                end.Property(x => x.Value)
                    .HasColumnName("EndDate");
            });

            builder.Property(x => x.UserId)
                   .HasColumnName("UserId")
                   .IsRequired();

            builder.Property(x => x.Active)
                   .HasColumnName("Active")
                   .IsRequired();
        }
    }
}