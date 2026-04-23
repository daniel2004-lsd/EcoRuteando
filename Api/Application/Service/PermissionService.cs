using AutoMapper;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class PermissionService
    {
        private readonly IPermissionRepository _repository;
        private readonly IMapper _mapper;

        public PermissionService(IPermissionRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task CreatePermission(PermissionCreateDto dto)
        {
            var permission = _mapper.Map<Permission>(dto);
            await _repository.CreateAsync(permission);
        }

        public async Task<List<PermissionResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();
            return _mapper.Map<List<PermissionResponseDto>>(list);
        }
    }
}