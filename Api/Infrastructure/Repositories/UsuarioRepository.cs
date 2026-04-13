//using Api.Domain.Entity;
//using Api.Domain.Interface;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace Api.Infrastructure.Repositories
//{
//    public class UsuarioRepository : Repository<Usuario>, IUsuarioRepository
//    {
//        public Task<Usuario> ObtenerPorCorreo(string correo)
//        {
//            var usuario = _data.FirstOrDefault(x => x.Correo == correo);
//            return Task.FromResult(usuario);
//        }
//    }
//}
