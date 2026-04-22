using Api.Domain.Enums;
using Api.Domain.Enums.genery;
using Api.Domain.ValueObjects;
using System;
using System.Collections.Generic;

namespace Api.Domain.Entities
{
    public class ObstacleReport : EntityGenery
    {
        public int ProfileId { get; set; }
        public Profile Profile { get; set; }
        public ObstacleType Type { get; set; }
        public string Description { get; set; }
        public Coordinates Location { get; set; }
        public UrlImagen PhotoUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<ReportValidation> ReportValidation { get; set; } = new List<ReportValidation>();

        public bool Active { get; set; } = true;
    }
}