using Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Infrastructure.Data.Configurations
{
    public class PermissionConfiguration : IEntityTypeConfiguration<Permission>
    {
        public void Configure(EntityTypeBuilder<Permission> builder)
        {
            builder.HasKey(x => x.Id);

            builder.OwnsOne(x => x.Name, n =>
            {
                n.Property(x => x.Value)
                 .HasColumnName("Name")
                 .IsRequired();
            });

            builder.Property(x => x.Description)
                   .HasColumnName("Description")
                   .IsRequired();
        }
    }
}