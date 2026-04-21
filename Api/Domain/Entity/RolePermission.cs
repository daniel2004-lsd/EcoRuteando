using Api.Domain.Entity.Enums.genery;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Domain.Entity
{
    public class RolePermission : EntityGenery
    {
        public int RoleId { get; set; }
        public int PermissionId { get; set; }

        [ForeignKey("RoleId")]
        public virtual Role RoleEntity { get; set; }

        [ForeignKey("PermissionId")]
        public virtual Permission PermissionEntity { get; set; }
    }
}