using Api.Domain.Enums;
using Api.Domain.Enums.genery;
using Api.Domain.ValueObjects;
using System;

namespace Api.Domain.Entities
{
    public class PointOfInterest : EntityGenery
    {
        public PlaceName Name { get; set; }
        public PointCategory Category { get; set; }
        public Coordinates Location { get; set; }
        public string Address { get; set; }
        public int CreatedBy { get; set; }
        public Profile Profile { get; set; }

        public bool Active { get; set; } = true;
    }
}