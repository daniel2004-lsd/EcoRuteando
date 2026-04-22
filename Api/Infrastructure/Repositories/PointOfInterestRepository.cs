using Api.Domain.Entities;
using Api.Domain.Interface;
using Api.Infrastructure.Data;

namespace Api.Infrastructure.Repositories
{
    public class PointOfInterestRepository : Repository<PointOfInterest>, IPointOfInterestRepository
    {
        public PointOfInterestRepository(AppDbContext context) : base(context)
        {
        }
    }
}