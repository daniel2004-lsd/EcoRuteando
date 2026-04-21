using Api.Domain;
using Api.Domain.Entity;
using Api.Domain.Interface;
using Api.Infrastructure.Data;

namespace Api.Infrastructure.Repositories
{
    public class PermissionRepository : Repository<Permission>, IPermissionRepository
    {
        public PermissionRepository(AppDbContext context) : base(context)
        {
        }
    }
}