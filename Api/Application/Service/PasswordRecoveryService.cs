using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using Api.Domain.ValueObjects;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class PasswordRecoveryService
    {
        private readonly IPasswordRecoveryRepository _repository;

        public PasswordRecoveryService(IPasswordRecoveryRepository repository)
        {
            _repository = repository;
        }

        public async Task CreateRequest(PasswordRecoveryCreateDto dto)
        {
            var recovery = new PasswordRecovery
            {
                UserId = dto.UserId,
                TemporaryCode = new RecoveryCode(dto.Code),
                ExpirationDate = new ExpirationDate(dto.ExpirationDate),
                IsUsed = false
            };

            await _repository.CreateAsync(recovery);
        }

        public async Task<List<PasswordRecoveryResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();

            return list.Select(x => new PasswordRecoveryResponseDto(
                x.UserId,
                x.TemporaryCode.Value,
                x.ExpirationDate.Value,
                x.IsUsed,
                x.Active 
            )).ToList();
        }
    }
}