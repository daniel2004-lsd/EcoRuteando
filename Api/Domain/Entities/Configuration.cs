using Api.Domain.Enums;
using Api.Domain.Enums.genery;
using System;
using System.Collections.Generic;

namespace Api.Domain.Entities
{
    public class Configuration : EntityGenery
    {
        public Language Language { get; set; }
        public Theme BackgroundColor { get; set; }
        public ICollection<Profile> Profile { get; set; } = new List<Profile>();

        public bool Active { get; set; } = true;

    }
}