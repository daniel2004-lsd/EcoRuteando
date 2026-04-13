using Api.Domain.Entity.Enums;
using Api.Domain.Entity.genery;
using Api.Domain.Entity.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity
{
    public class Ruta : EntityGenery
    {
        public NombreRuta Nombre { get; set; }
        public string Descripcion { get; set; }
        public Trayecto GeometriaTrayecto { get; set; }
        public Distancia DistanciaKm { get; set; }
        public Tiempo TiempoEstimado { get; set; }
        public int CreadoPor { get; set; }
        public DateTime FechaCreada { get; set; } = DateTime.Now;
    }
}
