using Api.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Infrastructure.Data.Configurations
{
    public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
    {
        public void Configure(EntityTypeBuilder<AuditLog> builder)
        {
            builder.HasKey(x => x.Id);

            builder.OwnsOne(x => x.IpAddress, ip =>
            {
                ip.Property(x => x.Value)
                  .HasColumnName("IpAddress")
                  .IsRequired();
            });

            builder.Property(x => x.TableName)
                   .HasColumnName("TableName")
                   .IsRequired();

            builder.Property(x => x.Action)
                   .HasColumnName("Action")
                   .IsRequired();

            builder.Property(x => x.UserId)
                   .HasColumnName("UserId")
                   .IsRequired();

            builder.Property(x => x.CreatedAt)
                   .HasColumnName("CreatedAt")
                   .IsRequired();
        }
    }
}