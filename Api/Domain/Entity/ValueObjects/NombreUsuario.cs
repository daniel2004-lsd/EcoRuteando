using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.ValueObjects
{
    public class NombreUsuario
    {
        public string Valor { get; }

        public NombreUsuario(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor))
                throw new Exception("El nombre no puede estar vacío");

            if (valor.Length < 2)
                throw new Exception("Nombre muy corto");

            Valor = valor.Trim();
        }
    }
}
