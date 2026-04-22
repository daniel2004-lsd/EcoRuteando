using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.ValueObjects
{
    public class Password
    {
        public string Value { get; private set; }

        private Password() { } 

        public Password(string valor) 
        {
            if (string.IsNullOrWhiteSpace(valor))
                throw new ArgumentException("La contraseña no puede estar vacía");

            Value = valor;
        }
    }
}
