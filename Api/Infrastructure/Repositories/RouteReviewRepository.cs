using Api.Domain.Entity;
using Api.Domain.Interface;
using Api.Infrastructure.Data;

namespace Api.Infrastructure.Repositories
{
    public class RouteReviewRepository : Repository<RouteReview>, IRouteReviewRepository
    {
        public RouteReviewRepository(AppDbContext context) : base(context)
        {
        }
    }
}