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
    public class PuntoInteres : EntityGenery
    {
        public NombreLugar Nombre { get; set; }
        public CategoriaPunto Categoria { get; set; }
        public Coordenadas GeometriaUbicacion { get; set; }
        public string Direccion { get; set; }
        public int CreadoPor { get; set; }
    }
}
