using Api.Domain.Entity.genery;
using Api.Domain.Entity.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity
{
    public class Perfil:EntityGenery
    {
        public int IdSesion { get; set; }
        public int IdConfiguracion { get; set; }
        public Telefono Telefono { get; set; }
        public UrlImagen FotoPerfil { get; set; }
    }
}
