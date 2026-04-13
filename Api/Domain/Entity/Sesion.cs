using Api.Domain.Entity.genery;
using Api.Domain.Entity.ValueObjects;
using Api.Domain.Entity.ValueObjects.Api.Domain.Entity.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity
{
    public class Sesion : EntityGenery
    {
        public int IdUsuario { get; set; }
        public DateTime FechaInicio { get; set; } = DateTime.UtcNow;
        public FechaFinSesion FechaFin { get; set; }
        public DireccionIP DireccionIp { get; set; }
    }
}
