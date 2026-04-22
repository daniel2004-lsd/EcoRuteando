using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Enums;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Linq; 
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