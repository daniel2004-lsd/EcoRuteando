using Api.Application.EntityDto;
using Api.Application.EntityDto.end;
using Api.Application.EntityDto.start;
using Api.Domain.Entity;
using Api.Domain.Entity.Enums;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Linq; // <--- Importante para el .Select()
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class ConfigurationService
    {
        private readonly IConfigurationRepository _repository;

        public ConfigurationService(IConfigurationRepository repository)
        {
            _repository = repository;
        }

        public async Task CreateConfiguration(ConfigurationCreateDto dto)
        {
            var config = new Configuration
            {
                Language = (Language)dto.LanguageId,
                BackgroundColor = (Theme)dto.BackgroundColorId
            };

            await _repository.CreateAsync(config);
        }

        public async Task<List<ConfigurationResponseDto>> GetAll()
        {
            // Cambiado de GetAll a GetAllAsync
            var list = await _repository.GetAllAsync();

            return list.Select(x => new ConfigurationResponseDto(
                x.Language.ToString(),
                x.BackgroundColor.ToString(),
                x.Active 
            )).ToList();
        }
    }
}