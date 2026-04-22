using Api.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Domain.Interface
{
    public interface ISessionRepository : IRepository<Session>
    {
        Task<List<Session>> GetByUserIdAsync(int userId);
    }
}