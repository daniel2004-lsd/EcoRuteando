using Api.Domain.Entities;
using Api.Domain.Interface;
using Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Infrastructure.Repositories
{
    public class UserRoleRepository : Repository<UserRole>, IUserRoleRepository
    {
        private readonly AppDbContext _context;

        public UserRoleRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<UserRole>> GetWithDetailsAsync()
        {
            return await _context.Set<UserRole>()
                .Include(x => x.Role)
                .Include(x => x.User)
                .ToListAsync();
        }
    }
}