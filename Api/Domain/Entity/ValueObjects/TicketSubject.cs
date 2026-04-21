using System;

namespace Api.Domain.Entity.ValueObjects
{
    public class TicketSubject
    {
        public string Value { get; }

        private TicketSubject() { }

        public TicketSubject(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Subject cannot be empty");

            if (value.Length < 5)
                throw new ArgumentException("Subject is too short");

            if (value.Length > 100)
                throw new ArgumentException("Subject is too long");

            Value = value.Trim();
        }

        public override string ToString() => Value;
    }
}