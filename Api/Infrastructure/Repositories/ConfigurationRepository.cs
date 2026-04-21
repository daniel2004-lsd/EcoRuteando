using Api.Domain.Entity;
using Api.Domain.Interface;
using Api.Infrastructure.Data;

namespace Api.Infrastructure.Repositories
{
    public class ConfigurationRepository : Repository<Configuration>, IConfigurationRepository
    {
        public ConfigurationRepository(AppDbContext context) : base(context)
        {
        }
    }
}