using System;
using System.Text.RegularExpressions;

namespace Api.Domain.Entity.ValueObjects
{
    public class Email
    {
        public string Value { get; }

        private Email() { }

        public Email(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("El correo no puede estar vacío", nameof(value));

            value = value.Trim();

            if (!Regex.IsMatch(value, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                throw new ArgumentException("El correo no tiene un formato válido", nameof(value));

            Value = value;
        }
    }
}