using System;

namespace Api.Domain.Entity.ValueObjects
{
    public class PlaceName
    {
        public string Value { get; }

        private PlaceName() { }

        public PlaceName(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("El nombre es obligatorio", nameof(value));

            Value = value.Trim();
        }
    }
}