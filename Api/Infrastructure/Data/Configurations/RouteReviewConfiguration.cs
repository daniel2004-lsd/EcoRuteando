using Api.Domain.Entity;
using Api.Domain.Entity.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Infrastructure.Data.Configurations
{
    public class RouteReviewConfiguration : IEntityTypeConfiguration<RouteReview>
    {
        public void Configure(EntityTypeBuilder<RouteReview> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Rating)
                .HasConversion(
                    v => v.Value,
                    v => new Rating(v)
                )
                .HasColumnName("Rating")
                .IsRequired();

            builder.Property(x => x.Comment)
                .HasColumnName("Comment")
                .IsRequired();

            builder.Property(x => x.CreatedAt)
                .HasColumnName("CreatedAt")
                .IsRequired();

            builder.Property(x => x.ProfileId)
                .HasColumnName("ProfileId")
                .IsRequired();

            builder.Property(x => x.RouteId)
                .HasColumnName("RouteId")
                .IsRequired();
        }
    }
}