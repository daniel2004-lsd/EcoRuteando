using Api.Domain.Entity.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.ValueObjects
{
    public class Trayecto
    {
        public List<Coordenadas> Puntos { get; private set; }

        private Trayecto() { }

        public Trayecto(List<Coordenadas> puntos)
        {
            if (puntos == null || puntos.Count < 2)
                throw new Exception("Una ruta debe tener mínimo 2 puntos");

            Puntos = puntos;
        }
    }
}
