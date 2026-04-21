using Api.Domain.Entity.Enums.genery;
using Api.Domain.Entity.ValueObjects;
using System;

namespace Api.Domain
{
    public class Permission : EntityGenery
    {
        public PermissionName Name { get; set; }
        public string Description { get; set; }

        public bool Active { get; set; }
    }
}