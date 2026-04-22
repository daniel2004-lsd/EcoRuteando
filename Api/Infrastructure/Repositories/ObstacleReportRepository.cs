using Api.Domain.Entities;
using Api.Domain.Interface;
using Api.Infrastructure.Data;

namespace Api.Infrastructure.Repositories
{
    public class ObstacleReportRepository : Repository<ObstacleReport>, IObstacleReportRepository
    {
        public ObstacleReportRepository(AppDbContext context) : base(context)
        {
        }
    }
}