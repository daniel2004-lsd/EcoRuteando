using Api.Domain.Enums.genery;
using Api.Domain.ValueObjects;
using System;

namespace Api.Domain.Entities
{
    public class RouteReview : EntityGenery
    {
        public int ProfileId { get; set; }
        public int RouteId { get; set; }
        public Profile Profile { get; set; }
        public Route Route { get; set; }

        public Rating Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool Active { get; set; } = true;
    }
}