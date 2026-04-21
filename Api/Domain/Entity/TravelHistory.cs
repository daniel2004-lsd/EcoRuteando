using Api.Domain.Entity.Enums.genery;
using Api.Domain.Entity.ValueObjects;
using System;

namespace Api.Domain
{
    public class TravelHistory : EntityGenery
    {
        public int ProfileId { get; set; }
        public int RouteId { get; set; }
        public CO2 CO2SavedKg { get; set; }
        public TimeRange TimeRange { get; set; }
        public bool IsCompleted { get; set; }
    }
}