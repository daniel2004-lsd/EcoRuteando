using Api.Application.EntityDto;
using Api.Application.EntityDto.end;
using Api.Application.EntityDto.start;
using Api.Domain.Entity;
using Api.Domain.Entity.ValueObjects;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace Api.Application.Service
{
    public class ProfileService
    {
        private readonly IProfileRepository _repository;

        public ProfileService(IProfileRepository repository)
        {
            _repository = repository;
        }

        public async Task CreateProfile(ProfileCreateDto dto)
        {
            var profile = new Profile
            {
                SessionId = dto.SessionId,
                ConfigurationId = dto.ConfigurationId,
                PhoneNumber = new PhoneNumber(dto.PhoneNumber),
                ProfilePicture = new UrlImagen(dto.ProfilePicture)
            };

            await _repository.CreateAsync(profile);
        }

        public async Task<List<ProfileResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();

            return list.Select(x => new ProfileResponseDto(
                x.SessionId,
                x.PhoneNumber.Value,
                x.ProfilePicture.Value, 
                x.Active
            )).ToList();
        }
    }
}