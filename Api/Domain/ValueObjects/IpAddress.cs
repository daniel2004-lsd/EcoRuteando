using System;
using System.Net;

namespace Api.Domain.ValueObjects
{
    public class IpAddress
    {
        public string Value { get; }

        private IpAddress() { }

        public IpAddress(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("La dirección IP no puede estar vacía", nameof(value));

            value = value.Trim();

            if (!IPAddress.TryParse(value, out _))
                throw new ArgumentException("Formato de IP inválido", nameof(value));

            Value = value;
        }

        public override string ToString() => Value;

        public override bool Equals(object obj)
        {
            if (obj is not IpAddress other) return false;
            return Value == other.Value;
        }

        public override int GetHashCode()
        {
            return Value.GetHashCode();
        }
    }
}