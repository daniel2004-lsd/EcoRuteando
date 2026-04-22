using Api.Domain.Enums.genery;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Domain.Entities
{
    public class UserRole : EntityGenery
    {
        public int RoleId { get; set; }
        public int UserId { get; set; }

        public Role Role { get; set; }

        public  User User { get; set; }

        public bool Active { get; set; } = true;
    }
}