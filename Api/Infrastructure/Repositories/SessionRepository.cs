using Api.Domain.Entity;
using Api.Domain.Interface;
using Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Infrastructure.Repositories
{
    public class SessionRepository : Repository<Session>, ISessionRepository
    {
        private readonly AppDbContext _context;

        public SessionRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<Session>> GetByUserIdAsync(int userId)
        {
            return await _context.Set<Session>()
                .Where(s => s.UserId == userId)
                .ToListAsync();
        }
    }
}