using Api.Domain.Entity.Enums.genery;
using Api.Domain.Entity.ValueObjects;
using System;

namespace Api.Domain.Entity
{
    public class SupportTicket : EntityGenery
    {
        public int ProfileId { get; set; }
        public TicketSubject Subject { get; set; }
        public TicketPriority Priority { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}