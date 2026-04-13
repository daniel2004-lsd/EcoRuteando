using Api.Domain.Entity.genery;
using Api.Domain.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Infrastructure.Repositories
{
    public class Repository<T> : IRepository<T> where T : EntityGenery
    {
        protected readonly List<T> _data = new List<T>();

        public Task<T> ObtenerPorId(int id)
        {
            var entity = _data.FirstOrDefault(x => x.Id == id);
            return Task.FromResult(entity);
        }

        public Task<List<T>> ObtenerTodos()
        {
            return Task.FromResult(_data);
        }

        public Task Crear(T entity)
        {
            _data.Add(entity);
            return Task.CompletedTask;
        }

        public Task Actualizar(T entity)
        {
            var existente = _data.FirstOrDefault(x => x.Id == entity.Id);
            if (existente != null)
            {
                _data.Remove(existente);
                _data.Add(entity);
            }
            return Task.CompletedTask;
        }

        public Task Eliminar(int id)
        {
            var entity = _data.FirstOrDefault(x => x.Id == id);
            if (entity != null)
                _data.Remove(entity);

            return Task.CompletedTask;
        }
    }
}
