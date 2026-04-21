using Api.Application.EntityDto;
using Api.Application.EntityDto.end;
using Api.Application.EntityDto.start;
using Api.Domain;
using Api.Domain.Entity;
using Api.Domain.Entity.ValueObjects;
using Api.Domain.Interface;
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