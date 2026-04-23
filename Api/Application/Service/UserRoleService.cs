using AutoMapper;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class UserRoleService
    {
        private readonly IUserRoleRepository _repository;
        private readonly IMapper _mapper;

        public UserRoleService(IUserRoleRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task AssignRole(UserRoleCreateDto dto)
        {
            var relation = _mapper.Map<UserRole>(dto);
            await _repository.CreateAsync(relation);
        }

        public async Task<List<UserRoleResponseDto>> GetAll()
        {
            var list = await _repository.GetWithDetailsAsync();
            return _mapper.Map<List<UserRoleResponseDto>>(list);
        }
    }
}