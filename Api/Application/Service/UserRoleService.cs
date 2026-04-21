using Api.Application.EntityDto;
using Api.Application.EntityDto.end;
using Api.Application.EntityDto.start;
using System.Linq; 
using Api.Domain.Entity;
using Api.Domain.Interface;
using Api.Infrastructure.Repositories;
using System.Collections.Generic;
using System.Linq; 
using System.Threading.Tasks;

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
            x.RoleEntity?.Name.ToString() ?? "No Role",
            x.UserEntity?.Email.Value ?? "No Email",
            x.Active
        )).ToList();
    }
}
}