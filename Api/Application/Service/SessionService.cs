using AutoMapper;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class SessionService
    {
        private readonly ISessionRepository _repository;
        private readonly IMapper _mapper;

        public SessionService(ISessionRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task CreateSession(SessionCreateDto dto)
        {
            var session = _mapper.Map<Session>(dto);
            session.StartDate = System.DateTime.UtcNow;

            await _repository.CreateAsync(session);
        }

        public async Task<List<SessionResponseDto>> GetAll()
        {
            var sessions = await _repository.GetAllAsync();
            return _mapper.Map<List<SessionResponseDto>>(sessions);
        }
    }
}