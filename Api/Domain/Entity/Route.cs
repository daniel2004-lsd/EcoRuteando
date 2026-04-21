using Api.Domain.Entity.Enums;
using Api.Domain.Entity.Enums.genery;
using Api.Domain.Entity.ValueObjects;
using Microsoft.AspNetCore.Components;
using System;

namespace Api.Domain.Entity
{
    public class Route : EntityGenery
    {
        public RouteName Name { get; set; }
        public string Description { get; set; }
        public RoutePath Path { get; set; }
        public Distance DistanceKm { get; set; }
        public TimeValue EstimatedTime { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}