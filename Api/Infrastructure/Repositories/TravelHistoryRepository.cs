using Api.Domain.Entities;
using Api.Domain.Interface;
using Api.Infrastructure.Data;

namespace Api.Infrastructure.Repositories
{
    public class TravelHistoryRepository : Repository<TravelHistory>, ITravelHistoryRepository
    {
        public TravelHistoryRepository(AppDbContext context) : base(context)
        {
        }
    }
}