using System;

namespace Api.Domain.Entity.ValueObjects
{
    public class TimeValue
    {
        public int Value { get; }

        private TimeValue() { }

        public TimeValue(int value)
        {
            if (value <= 0)
                throw new ArgumentOutOfRangeException(nameof(value), "El tiempo debe ser mayor a cero");

            Value = value;
        }

        public TimeSpan ToTimeSpan() => TimeSpan.FromMinutes(Value);
    }
}