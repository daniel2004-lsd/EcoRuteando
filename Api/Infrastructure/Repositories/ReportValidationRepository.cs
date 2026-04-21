using Api.Domain.Entity;
using Api.Domain.Interface;
using Api.Infrastructure.Data;

namespace Api.Infrastructure.Repositories
{
    public class ReportValidationRepository : Repository<ReportValidation>, IReportValidationRepository
    {
        public ReportValidationRepository(AppDbContext context) : base(context)
        {
        }
    }
}