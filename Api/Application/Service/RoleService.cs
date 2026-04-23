using AutoMapper;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class RoleService
    {
        private readonly IRoleRepository _repository;
        private readonly IMapper _mapper;

        public RoleService(IRoleRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task CreateRole(RoleCreateDto dto)
        {
            var role = _mapper.Map<Role>(dto);
            await _repository.CreateAsync(role);
        }

        public async Task<List<RoleResponseDto>> GetAll()
        {
            var roles = await _repository.GetAllAsync();
            return _mapper.Map<List<RoleResponseDto>>(roles);
        }
    }
}