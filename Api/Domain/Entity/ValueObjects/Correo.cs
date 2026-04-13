using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.ValueObjects
{
    public class Correo
    {
        public string Valor { get; private set; }

        private Correo() { } 

        public Correo(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor) || !valor.Contains("@"))
                throw new Exception("Correo inválido");

            Valor = valor;
        }
    }
}
