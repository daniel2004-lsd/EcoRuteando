using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.ValueObjects
{
    public class NombreRuta
    {
        public string Valor { get; private set; }

        private NombreRuta() { }

        public NombreRuta(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor))
                throw new Exception("Nombre requerido");

            if (valor.Length < 3)
                throw new Exception("Nombre muy corto");

            Valor = valor;
        }
    }
}
