using Api.Domain.Entity.Enums;
using Api.Domain.Entity.Enums.genery;
using Api.Domain.Entity.ValueObjects;
using System;

namespace Api.Domain.Entity
{
    public class PointOfInterest : EntityGenery
    {
        public PlaceName Name { get; set; }
        public PointCategory Category { get; set; }
        public Coordinates Location { get; set; }
        public string Address { get; set; }
        public int CreatedBy { get; set; }
    }
}