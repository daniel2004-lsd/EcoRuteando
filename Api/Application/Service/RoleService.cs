using Api.Application.EntityDto;
using Api.Application.EntityDto.end;
using Api.Application.EntityDto.start;
using Api.Domain.Entity;
using Api.Domain.Entity.Enums;
using Api.Domain.Interface;
using Api.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq; 
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class RoleService
    {
        private readonly IRoleRepository _repository;

        public RoleService(IRoleRepository repository)
        {
            _repository = repository;
        }

        public async Task CreateRole(RoleCreateDto dto)
        {
            if (!Enum.TryParse<RoleType>(dto.Name, true, out var roleType))
            {
                throw new ArgumentException($"El nombre de rol '{dto.Name}' no es válido.");
            }

            var role = new Role
            {
                Name = roleType, 
                Description = dto.Description
            };

            await _repository.CreateAsync(role);
        }

        public async Task<List<RoleResponseDto>> GetAll()
        {
            var roles = await _repository.GetAllAsync();

            return roles.Select(r => new RoleResponseDto(
                r.Name.ToString(),
                r.Description,
                r.Active 
            )).ToList();
        }
    }
}