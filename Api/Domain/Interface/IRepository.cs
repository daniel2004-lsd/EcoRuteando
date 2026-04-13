using Api.Domain.Entity.genery;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Interface
{
    public interface IRepository<T> where T : EntityGenery
    {
        Task<T> ObtenerPorId(int id);
        Task<List<T>> ObtenerTodos();
        Task Crear(T entity);
        Task Actualizar(T entity);
        Task Eliminar(int id);
    }
}
