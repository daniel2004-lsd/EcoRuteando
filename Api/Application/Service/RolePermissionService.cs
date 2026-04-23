using AutoMapper;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class RolePermissionService
    {
        private readonly IPermissionRoleRepository _repository;
        private readonly IMapper _mapper;

        public RolePermissionService(IPermissionRoleRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task AssignPermission(RolePermissionCreateDto dto)
        {
            var relation = _mapper.Map<RolePermission>(dto);
            await _repository.CreateAsync(relation);
        }

        public async Task<List<RolePermissionResponseDto>> GetAll()
        {
            var list = await _repository.GetWithDetailsAsync();
            return _mapper.Map<List<RolePermissionResponseDto>>(list);
        }
    }
}