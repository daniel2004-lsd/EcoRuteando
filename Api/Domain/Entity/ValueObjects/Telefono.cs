using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.ValueObjects
{
    public class Telefono
    {
        public string Valor { get; private set; }

        private Telefono() { }

        public Telefono(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor) || valor.Length < 7)
                throw new Exception("Teléfono inválido");

            Valor = valor;
        }
    }
}
