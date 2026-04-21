using Api.Application.EntityDto;
using Api.Application.EntityDto.end;
using Api.Application.EntityDto.start;
using Api.Domain.Entity;
using Api.Domain.Entity.ValueObjects;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Linq; 
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class UserService
    {
        private readonly IUserRepository _repository;

        public UserService(IUserRepository repository)
        {
            _repository = repository;
        }

        public async Task CreateUser(UserCreateDto dto)
        {
            var user = new User
            {
                Name = new Username(dto.Name),
                LastName = dto.LastName,
                Email = new Email(dto.Email),
                Password = new Password(dto.Password)
            };

            await _repository.CreateAsync(user);
        }

        public async Task<List<UserResponseDto>> GetAll()
        {
            var users = await _repository.GetAllAsync();

            return users.Select(u => new UserResponseDto(
                u.Name.Value,
                u.LastName,
                u.Email.Value,
                u.Active
            )).ToList();
        }

        public async Task<UserResponseDto?> GetById(int id)
        {
            var user = await _repository.GetByIdAsync(id);

            if (user == null)
                return null;

            return new UserResponseDto(
                user.Name.Value,
                user.LastName,
                user.Email.Value,
                user.Active
            );
        }
    }
}