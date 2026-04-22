using Api.Domain.Enums.genery;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Domain.Entities
{
    public class RolePermission : EntityGenery
    {
        public int RoleId { get; set; }
        public int PermissionId { get; set; }

        public bool Active { get; set; } = true;

        public  Role Role { get; set; }

        public  Permission Permission { get; set; }
    }
}