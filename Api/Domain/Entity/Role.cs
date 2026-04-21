using Api.Domain.Entity.Enums;
using Api.Domain.Entity.Enums.genery;
using System;

namespace Api.Domain.Entity
{
    public class Role : EntityGenery
    {
        public RoleType Name { get; set; }
        public string Description { get; set; }
    }
}