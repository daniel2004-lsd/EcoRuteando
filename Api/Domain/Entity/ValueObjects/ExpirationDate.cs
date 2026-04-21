using System;

namespace Api.Domain.Entity.ValueObjects
{
    public class ExpirationDate
    {
        public DateTime Value { get; }

        private ExpirationDate() { }

        public ExpirationDate(DateTime value)
        {
            if (value <= DateTime.UtcNow)
                throw new ArgumentException("La fecha de expiración debe ser futura", nameof(value));

            Value = value;
        }

        public bool IsExpired() => DateTime.UtcNow > Value;
    }
}