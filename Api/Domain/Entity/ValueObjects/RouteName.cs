using System;

namespace Api.Domain.Entity.ValueObjects
{
    public class RouteName
    {
        public string Value { get; }

        private RouteName() { }

        public RouteName(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("El nombre es obligatorio", nameof(value));

            value = value.Trim();

            if (value.Length < 3)
                throw new ArgumentException("El nombre es muy corto", nameof(value));

            Value = value;
        }
    }
}