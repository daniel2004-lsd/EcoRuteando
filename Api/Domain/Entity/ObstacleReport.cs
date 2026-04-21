using Api.Domain.Entity.Enums;
using Api.Domain.Entity.Enums.genery;
using Api.Domain.Entity.ValueObjects;
using System;

namespace Api.Domain.Entity
{
    public class ObstacleReport : EntityGenery
    {
        public int ProfileId { get; set; }
        public ObstacleType Type { get; set; }
        public string Description { get; set; }
        public Coordinates Location { get; set; }
        public UrlImagen PhotoUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}