using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.Enums
{
    public class Coordenadas
    {
        public double Latitud { get; private set; }
        public double Longitud { get; private set; }

        private Coordenadas() { }

        public Coordenadas(double lat, double lng)
        {
            if (lat < -90 || lat > 90)
                throw new Exception("Latitud inválida");

            if (lng < -180 || lng > 180)
                throw new Exception("Longitud inválida");

            Latitud = lat;
            Longitud = lng;
        }
    }
}
