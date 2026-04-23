using AutoMapper;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class UserService
    {
        private readonly IUserRepository _repository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task CreateUser(UserCreateDto dto)
        {
            var user = _mapper.Map<User>(dto);
            await _repository.CreateAsync(user);
        }

        public async Task<List<UserResponseDto>> GetAll()
        {
            var users = await _repository.GetAllAsync();
            return _mapper.Map<List<UserResponseDto>>(users);
        }

        public async Task<UserResponseDto?> GetById(int id)
        {
            var user = await _repository.GetByIdAsync(id);
            if (user == null) return null;

            return _mapper.Map<UserResponseDto>(user);
        }
    }
}