using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.ValueObjects
{

    public class UrlImagen
    {
        public string Value { get; private set; }

        private UrlImagen() { }

        public UrlImagen(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor))
                throw new Exception("URL inválida");

            if (!Uri.TryCreate(valor, UriKind.Absolute, out var uri))
                throw new Exception("Formato de URL inválido");

            if (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps)
                throw new Exception("La URL debe ser http o https");

            Value = valor;
        }
    }
}
