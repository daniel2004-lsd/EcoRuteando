using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.ValueObjects
{
    public class Password
    {
        public string Valor { get; private set; }

        public Password(string valor)
        {
            if (valor.Length < 6)
                throw new Exception("Contraseña muy corta");

            Valor = valor;
        }
    }
}
