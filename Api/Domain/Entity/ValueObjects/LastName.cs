using System;

namespace Api.Domain.Entity.ValueObjects
{
    public class LastName
    {
        public string Value { get; }

        public LastName(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Last name cannot be empty");

            Value = value.Trim();
        }
    }
}