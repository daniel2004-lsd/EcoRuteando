using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using Api.Domain.ValueObjects;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class PermissionService
    {
        private readonly IPermissionRepository _repository;

        public PermissionService(IPermissionRepository repository)
        {
            _repository = repository;
        }

        public async Task CreatePermission(PermissionCreateDto dto)
        {
            var permission = new Permission
            {
                Name = new PermissionName(dto.Name),
                Description = dto.Description
            };

            await _repository.CreateAsync(permission);
        }

        public async Task<List<PermissionResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();

            return list.Select(p => new PermissionResponseDto(
                p.Name.Value,
                p.Description,
                p.Active 
            )).ToList();
        }
    }
}