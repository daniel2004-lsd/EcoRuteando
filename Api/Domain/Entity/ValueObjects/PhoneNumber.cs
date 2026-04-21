using System;
using System.Text.RegularExpressions;

namespace Api.Domain.Entity.ValueObjects
{
    public class PhoneNumber
    {
        public string Value { get; }

        private PhoneNumber() { }

        public PhoneNumber(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("El teléfono no puede estar vacío", nameof(value));

            value = value.Trim();

            if (!Regex.IsMatch(value, @"^\+?\d{7,15}$"))
                throw new ArgumentException("El teléfono no tiene un formato válido", nameof(value));

            Value = value;
        }
    }
}