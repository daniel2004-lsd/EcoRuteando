using System;

namespace Api.Domain.Entity.ValueObjects
{
    public class CO2
    {
        public decimal Value { get; private set; }

        private CO2() { }

        public CO2(decimal value)
        {
            if (value < 0)
                throw new ArgumentOutOfRangeException(nameof(value), "CO2 cannot be negative");

            Value = value;
        }
    }
}