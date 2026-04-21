using Api.Application.EntityDto;
using Api.Domain.Entity;
using Api.Domain.Entity.ValueObjects;
using Api.Domain.Interface;
using Api.Domain.Entity.Enums; 
using System;
using System.Collections.Generic;
using System.Linq; 
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class SupportTicketService
    {
        private readonly ISupportTicketRepository _repository;

        public SupportTicketService(ISupportTicketRepository repository)
        {
            _repository = repository;
        }

        public async Task CreateTicket(SupportTicketCreateDto dto)
        {
            var ticket = new SupportTicket
            {
                ProfileId = dto.ProfileId,
                Subject = new TicketSubject(dto.Subject),
                Priority = (TicketPriority)dto.PriorityId,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.CreateAsync(ticket);
        }

        public async Task<List<SupportTicketResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();

            return list.Select(x => new SupportTicketResponseDto(
                x.ProfileId,
                x.Subject.Value,
                x.Priority.ToString(),
                x.CreatedAt,
                x.Active
            )).ToList();
        }
    }
}