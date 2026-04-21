using Api.Domain.Entity.Enums.genery;
using Api.Domain.Entity.ValueObjects;
using System;

namespace Api.Domain.Entity
{
    public class Profile : EntityGenery
    {
        public int SessionId { get; set; }
        public int ConfigurationId { get; set; }
        public PhoneNumber PhoneNumber { get; set; }
        public UrlImagen ProfilePicture { get; set; }
    }
}