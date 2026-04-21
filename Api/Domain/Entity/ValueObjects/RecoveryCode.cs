using System;

namespace Api.Domain.Entity.ValueObjects
{
    public class RecoveryCode
    {
        public string Value { get; }

        private RecoveryCode() { }

        public RecoveryCode(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Recovery code cannot be empty", nameof(value));

            if (value.Length < 6)
                throw new ArgumentException("Recovery code must be at least 6 characters long", nameof(value));

            Value = value.Trim();
        }
    }
}