using Api.Domain.Entity.genery;
using Api.Domain.Entity.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain
{
    public class HistorialViajes:EntityGenery
    {
        public int IdPerfil { get; set; }
        public int IdRuta { get; set; }
        public CO2 CO2AhorradoKg { get; set; }
        public RangoTiempo Tiempo { get; set; }
        //public RangoTiempo HoraInicio { get; set; }
        //public DateTime HoraFin { get; set; }
        public bool Completado { get; set; }
    }
}
