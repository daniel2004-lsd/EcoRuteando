using Api.Domain.Entity;
using System.Threading.Tasks;

namespace Api.Domain.Interface
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
    }
}