using AutoMapper;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class AuditLogService
    {
        private readonly IAuditLogRepository _repository;
        private readonly IMapper _mapper;

        public AuditLogService(IAuditLogRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task Register(AuditLogCreateDto dto)
        {
            var log = _mapper.Map<AuditLog>(dto);
            log.CreatedAt = System.DateTime.UtcNow;

            await _repository.CreateAsync(log);
        }

        public async Task<List<AuditLogResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();
            return _mapper.Map<List<AuditLogResponseDto>>(list);
        }
    }
}