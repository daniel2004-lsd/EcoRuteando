using Api.Domain.Interface;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.ValueObjects;

namespace Api.Application.Service
{
    public class SessionService
    {
        private readonly ISessionRepository _repository;

        public SessionService(ISessionRepository repository)
        {
            _repository = repository;
        }

        public async Task CreateSession(SessionCreateDto dto)
        {
            var session = new Session
            {
                UserId = dto.UserId,
                IpAddress = new IpAddress(dto.IpAddress),
                StartDate = DateTime.UtcNow
            };

            await _repository.CreateAsync(session);
        }

        public async Task<List<SessionResponseDto>> GetAll()
        {
            var sessions = await _repository.GetAllAsync();

            return sessions.Select(s => new SessionResponseDto(
                s.UserId,
                s.StartDate,
                s.EndDate?.Value,
                s.IpAddress.Value,
                s.Active 
            )).ToList();
        }
    }
}