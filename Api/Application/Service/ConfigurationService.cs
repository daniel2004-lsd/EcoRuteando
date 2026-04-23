using AutoMapper;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class ConfigurationService
    {
        private readonly IConfigurationRepository _repository;
        private readonly IMapper _mapper;

        public ConfigurationService(IConfigurationRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task CreateConfiguration(ConfigurationCreateDto dto)
        {
            var config = _mapper.Map<Configuration>(dto);
            await _repository.CreateAsync(config);
        }

        public async Task<List<ConfigurationResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();
            return _mapper.Map<List<ConfigurationResponseDto>>(list);
        }
    }
}