using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
  using System.Net;

namespace Api.Domain.Entity.ValueObjects
{

    public class DireccionIP
    {
        public string Valor { get; }

        private DireccionIP() { } // para EF / serializers

        public DireccionIP(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor))
                throw new Exception("La dirección IP no puede estar vacía");

            if (!IPAddress.TryParse(valor, out _))
                throw new Exception("Formato de IP inválido");

            Valor = valor.Trim();
        }

        public override string ToString() => Valor;

        public override bool Equals(object obj)
        {
            if (obj is not DireccionIP other) return false;
            return Valor == other.Valor;
        }

        public override int GetHashCode()
        {
            return Valor.GetHashCode();
        }
    }

}
