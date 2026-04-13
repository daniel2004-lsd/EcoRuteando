using Api.Domain.Entity.genery;
using Api.Domain.Entity.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity
{
    public class Usuario : EntityGenery
    {
        public NombreUsuario Nombre { get; set; }
        public string Apellido { get; set; }
        public Password Contrasena { get; set; }
        public Correo Correo { get; set; }
    }
}
