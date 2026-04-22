using Api.Domain.Enums.genery;
using Api.Domain.ValueObjects;
using System;

namespace Api.Domain.Entities
{
    public class SupportTicket : EntityGenery
    {
        public int ProfileId { get; set; }

        public Profile Profile { get; set; }
        public TicketSubject Subject { get; set; }
        public TicketPriority Priority { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool Active { get; set; } = true;
    }
}