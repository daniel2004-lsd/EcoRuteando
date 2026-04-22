using System;

namespace Api.Domain.ValueObjects
{
    public class Distance
    {
        public decimal Value { get; }

        private Distance() { }

        public Distance(decimal value)
        {
            if (value <= 0)
                throw new ArgumentOutOfRangeException(nameof(value), "La distancia debe ser mayor a cero");

            Value = value;
        }
    }
}