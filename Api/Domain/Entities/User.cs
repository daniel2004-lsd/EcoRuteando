using Api.Domain.Enums.genery;
using Api.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entities
{
    public class User : EntityGenery
    {
        public Username Name { get; set; }
        public string LastName { get; set; }
        public Password Password { get; set; }
        public Email Email { get; set; }

        public ICollection<Session> Sessions { get; set; } = new List<Session>();

        public ICollection<UserRole> UserRole { get; set; } = new List<UserRole>();

        public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
        public ICollection<PasswordRecovery> PasswordRecovery { get; set; } = new List<PasswordRecovery>();

        public bool Active { get; set; } = true;
    }
}
