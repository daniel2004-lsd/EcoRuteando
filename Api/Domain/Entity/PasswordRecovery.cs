using Api.Domain.Entity.Enums.genery;
using Api.Domain.Entity.ValueObjects;
using System;

namespace Api.Domain.Entity
{
    public class PasswordRecovery : EntityGenery
    {
        public int UserId { get; set; }
        public RecoveryCode TemporaryCode { get; set; }
        public ExpirationDate ExpirationDate { get; set; }
        public bool IsUsed { get; set; }
    }
}