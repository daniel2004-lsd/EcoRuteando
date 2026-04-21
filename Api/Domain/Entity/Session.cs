using Api.Domain.Entity.Enums.genery;
using Api.Domain.Entity.ValueObjects;
using System;

namespace Api.Domain.Entity
{
    public class Session : EntityGenery
    {
        public int UserId { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public SessionEndDate EndDate { get; set; }
        public IpAddress IpAddress { get; set; }
    }
}