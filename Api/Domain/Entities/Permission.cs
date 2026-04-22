using Api.Domain.Enums.genery;
using Api.Domain.ValueObjects;
using System;
using System.Collections.Generic;

namespace Api.Domain.Entities
{
    public class Permission : EntityGenery
    {
        public PermissionName Name { get; set; }
        public string Description { get; set; }

        public ICollection<RolePermission> RolePermission { get; set; } = new List<RolePermission>();
        public bool Active { get; set; }
    }
}