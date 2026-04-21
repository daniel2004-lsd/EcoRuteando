using Api.Application.EntityDto;
using Api.Domain.Entity;
using Api.Domain.Entity.Enums;
using Api.Domain.Entity.ValueObjects;
using Api.Domain.Interface;
using System;
using System.Collections.Generic;
using System.Linq; 
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class AuditLogService
    {
        private readonly IAuditLogRepository _repository;

        public AuditLogService(IAuditLogRepository repository)
        {
            _repository = repository;
        }

        public async Task Register(AuditLogCreateDto dto)
        {
            var log = new AuditLog
            {
                UserId = dto.UserId,
                Action = (ActionType)dto.ActionId,
                TableName = Enum.Parse<TableName>(dto.TableName),
                OldData = dto.OldData, 
                NewData = dto.NewData,
                IpAddress = new IpAddress(dto.IpAddress),
                CreatedAt = DateTime.UtcNow
            };

            await _repository.CreateAsync(log);
        }

        public async Task<List<AuditLogResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();

            return list.Select(x => new AuditLogResponseDto(
                x.UserId,
                x.Action.ToString(),
                x.TableName.ToString(),
                x.OldData, 
                x.NewData,
                x.IpAddress.Value,
                x.CreatedAt
            )).ToList();
        }
    }
}