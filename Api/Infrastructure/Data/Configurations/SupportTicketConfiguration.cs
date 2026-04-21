using Api.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Infrastructure.Data.Configurations
{
    public class SupportTicketConfiguration : IEntityTypeConfiguration<SupportTicket>
    {
        public void Configure(EntityTypeBuilder<SupportTicket> builder)
        {
            builder.HasKey(x => x.Id);

            builder.OwnsOne(x => x.Subject, s =>
            {
                s.Property(x => x.Value)
                 .HasColumnName("Subject")
                 .IsRequired();
            });

            builder.Property(x => x.Priority)
                   .HasColumnName("Priority")
                   .IsRequired();

            builder.Property(x => x.CreatedAt)
                   .HasColumnName("CreatedAt")
                   .IsRequired();

            builder.Property(x => x.ProfileId)
                   .HasColumnName("ProfileId")
                   .IsRequired();
        }
    }
}