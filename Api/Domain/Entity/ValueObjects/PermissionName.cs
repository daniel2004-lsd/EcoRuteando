using System;
using System.Text.RegularExpressions;

namespace Api.Domain.Entity.ValueObjects
{
    public class PermissionName
    {
        public string Value { get; }

        private PermissionName() { }

        public PermissionName(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("El nombre del permiso es obligatorio", nameof(value));

            value = value.Trim().ToLower();

            if (!Regex.IsMatch(value, @"^[a-z]+_[a-z]+$"))
                throw new ArgumentException("Debe tener formato tipo: accion_recurso", nameof(value));

            Value = value;
        }
    }
}