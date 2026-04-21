using Api.Domain.Entity;
using Api.Domain.Interface;
using Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Infrastructure.Repositories
{
    public class PermissionRoleRepository : Repository<RolePermission>, IPermissionRoleRepository
    {
        private readonly AppDbContext _context;

        public PermissionRoleRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<RolePermission>> GetWithDetailsAsync()
        {
            return await _context.Set<RolePermission>()
                .Include(x => x.RoleEntity)
                .Include(x => x.PermissionEntity)
                .ToListAsync();
        }
    }
}