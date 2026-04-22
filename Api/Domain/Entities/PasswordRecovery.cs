using Api.Domain.Enums.genery;
using Api.Domain.ValueObjects;
using System;

namespace Api.Domain.Entities
{
    public class PasswordRecovery : EntityGenery
    {
        public int UserId { get; set; }

        public User User { get; set; }
        public RecoveryCode TemporaryCode { get; set; }
        public ExpirationDate ExpirationDate { get; set; }
        public bool IsUsed { get; set; }

        public bool Active { get; set; } = true;
    }
}