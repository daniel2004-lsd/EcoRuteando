using Api.Domain.Entity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Domain.Interface
{
    public interface IPermissionRoleRepository : IRepository<RolePermission>
    {
        Task<List<RolePermission>> GetWithDetailsAsync();
    }
}