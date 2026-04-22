using Api.Domain.Enums.genery;
using Api.Domain.ValueObjects;
using System;

namespace Api.Domain.Entities
{
    public class Session : EntityGenery
    {
        public int UserId { get; set; }

        public User User { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public SessionEndDate EndDate { get; set; }
        public IpAddress IpAddress { get; set; }

        public bool Active { get; set; } = true;
    }
}