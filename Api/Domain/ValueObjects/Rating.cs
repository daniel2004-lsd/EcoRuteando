using System;

namespace Api.Domain.ValueObjects
{
    public class Rating
    {
        public int Value { get; }

        public Rating(int value)
        {
            if (value < 1 || value > 5)
                throw new ArgumentOutOfRangeException(nameof(value), "Rating must be between 1 and 5");

            Value = value;
        }
    }
}