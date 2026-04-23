using AutoMapper;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class PasswordRecoveryService
    {
        private readonly IPasswordRecoveryRepository _repository;
        private readonly IMapper _mapper;

        public PasswordRecoveryService(IPasswordRecoveryRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task CreateRequest(PasswordRecoveryCreateDto dto)
        {
            var recovery = _mapper.Map<PasswordRecovery>(dto);
            await _repository.CreateAsync(recovery);
        }

        public async Task<List<PasswordRecoveryResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();
            return _mapper.Map<List<PasswordRecoveryResponseDto>>(list);
        }
    }
}