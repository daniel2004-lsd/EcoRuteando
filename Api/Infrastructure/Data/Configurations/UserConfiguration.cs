using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Api.Domain.Entity;

namespace Api.Infrastructure.Data.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.LastName)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.OwnsOne(x => x.Name, n =>
            {
                n.Property(p => p.Value)
                 .HasColumnName("Name")
                 .IsRequired();
            });

            builder.OwnsOne(x => x.Email, e =>
            {
                e.Property(p => p.Value)
                 .HasColumnName("Email")
                 .IsRequired();
            });

            builder.OwnsOne(x => x.Password, p =>
            {
                p.Property(p => p.Value)
                 .HasColumnName("Password")
                 .IsRequired();
            });
        }
    }
}