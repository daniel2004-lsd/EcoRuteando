using Api.Domain.Entity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Domain.Interface
{
    public interface IUserRoleRepository : IRepository<UserRole>
    {
        Task<List<UserRole>> GetWithDetailsAsync();
    }
}