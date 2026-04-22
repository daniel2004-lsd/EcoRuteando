using Api.Domain.Enums.genery;
using Api.Domain.ValueObjects;
using System;

namespace Api.Domain.Entities
{
    public class TravelHistory : EntityGenery
    {
        public int ProfileId { get; set; }
        public Profile Profile { get; set; }
        public int RouteId { get; set; }
        public Route Route { get; set; }

        public CO2 CO2SavedKg { get; set; }
        public TimeRange TimeRange { get; set; }
        public bool IsCompleted { get; set; }

        public bool Active { get; set; } = true;
    }
}