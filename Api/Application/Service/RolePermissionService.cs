using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class RolePermissionService
    {
        private readonly IPermissionRoleRepository _repository;

        public RolePermissionService(IPermissionRoleRepository repository)
        {
            _repository = repository;
        }

        public async Task AssignPermission(RolePermissionCreateDto dto)
        {
            var relation = new RolePermission
            {
                RoleId = dto.RoleId,
                PermissionId = dto.PermissionId
            };

            await _repository.CreateAsync(relation);
        }

        public async Task<List<RolePermissionResponseDto>> GetAll()
        {
            var list = await _repository.GetWithDetailsAsync();

            return list.Select(x => new RolePermissionResponseDto(
                x.Role != null ? x.Role.Name.ToString() : "No Role",
                x.Permission != null ? x.Permission.Name?.Value ?? "No Permission" : "No Permission",
                x.Active
            )).ToList();
        }
    }
}