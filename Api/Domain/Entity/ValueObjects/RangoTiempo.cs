using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.ValueObjects
{
    public class RangoTiempo
    {
        public DateTime Inicio { get; private set; }
        public DateTime Fin { get; private set; }

        private RangoTiempo() { }

        public RangoTiempo(DateTime inicio, DateTime fin)
        {
            if (fin <= inicio)
                throw new Exception("La fecha fin debe ser mayor a inicio");

            Inicio = inicio;
            Fin = fin;
        }
    }
}
