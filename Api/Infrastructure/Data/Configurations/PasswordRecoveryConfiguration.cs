using Api.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Infrastructure.Data.Configurations
{
    public class PasswordRecoveryConfiguration : IEntityTypeConfiguration<PasswordRecovery>
    {
        public void Configure(EntityTypeBuilder<PasswordRecovery> builder)
        {
            builder.HasKey(x => x.Id);

            builder.OwnsOne(x => x.TemporaryCode, c =>
            {
                c.Property(p => p.Value)
                 .HasColumnName("RecoveryCode")
                 .IsRequired();
            });

            builder.OwnsOne(x => x.ExpirationDate, e =>
            {
                e.Property(p => p.Value)
                 .HasColumnName("ExpirationDate")
                 .IsRequired();
            });

            builder.Property(x => x.IsUsed)
                   .HasColumnName("IsUsed")
                   .IsRequired();
        }
    }
}