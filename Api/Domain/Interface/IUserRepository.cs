using Api.Domain.Entities;
using System.Threading.Tasks;

namespace Api.Domain.Interface
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
    }
}