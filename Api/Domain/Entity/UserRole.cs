using Api.Domain.Entity.Enums.genery;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Domain.Entity
{
    public class UserRole : EntityGenery
    {
        public int RoleId { get; set; }
        public int UserId { get; set; }

        [ForeignKey("RoleId")]
        public virtual Role RoleEntity { get; set; }

        [ForeignKey("UserId")]
        public virtual User UserEntity { get; set; }
    }
}