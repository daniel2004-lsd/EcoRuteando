using System;

namespace Api.Domain.Entity.ValueObjects
{
    public class TimeRange
    {
        public DateTime Start { get; private set; }
        public DateTime End { get; private set; }

        private TimeRange() { }

        public TimeRange(DateTime start, DateTime end)
        {
            if (end <= start)
                throw new ArgumentException("End date must be greater than start date");

            Start = start;
            End = end;
        }

        public TimeSpan Duration => End - Start;
    }
}