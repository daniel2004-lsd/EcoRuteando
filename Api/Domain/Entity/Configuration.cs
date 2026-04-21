using Api.Domain.Entity.Enums;
using Api.Domain.Entity.Enums.genery;
using System;

namespace Api.Domain.Entity
{
    public class Configuration : EntityGenery
    {
        public Language Language { get; set; }
        public Theme BackgroundColor { get; set; }
    }
}