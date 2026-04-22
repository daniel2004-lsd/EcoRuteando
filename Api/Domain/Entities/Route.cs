using Api.Domain.Enums.genery;
using Api.Domain.ValueObjects;
using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;

namespace Api.Domain.Entities
{
    public class Route : EntityGenery
    {
        public RouteName Name { get; set; }
        public string Description { get; set; }
        public RoutePath Path { get; set; }
        public Distance DistanceKm { get; set; }
        public TimeValue EstimatedTime { get; set; }
        public int CreatedBy { get; set; }
        public Profile Profile { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool Active { get; set; } = true;
        public ICollection<TravelHistory> TravelHistory { get; set; } = new List<TravelHistory>();
    }
}