using System.Linq;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;

namespace Api.Application.Service
{
    public class UserRoleService
    {
        private readonly IUserRoleRepository _repository;

        public UserRoleService(IUserRoleRepository repository)
        {
            _repository = repository;
        }

        public async Task AssignRole(UserRoleCreateDto dto)
        {
            var relation = new UserRole
            {
                RoleId = dto.RoleId,
                UserId = dto.UserId
            };

            await _repository.CreateAsync(relation);
        }


public async Task<List<UserRoleResponseDto>> GetAll()
    {
        // CORRECCIÓN: Cambiar GetWithNamesAsync por GetWithDetailsAsync
        var list = await _repository.GetWithDetailsAsync();

        return list.Select(x => new UserRoleResponseDto(
            x.Role?.Name.ToString() ?? "No Role",
            x.User?.Email.Value ?? "No Email",
            x.Active
        )).ToList();
    }
}
}