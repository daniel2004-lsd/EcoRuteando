using AutoMapper;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class SupportTicketService
    {
        private readonly ISupportTicketRepository _repository;
        private readonly IMapper _mapper;

        public SupportTicketService(ISupportTicketRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task CreateTicket(SupportTicketCreateDto dto)
        {
            var ticket = _mapper.Map<SupportTicket>(dto);
            ticket.CreatedAt = System.DateTime.UtcNow;

            await _repository.CreateAsync(ticket);
        }

        public async Task<List<SupportTicketResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();
            return _mapper.Map<List<SupportTicketResponseDto>>(list);
        }
    }
}