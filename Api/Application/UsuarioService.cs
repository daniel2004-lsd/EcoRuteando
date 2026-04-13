using Api.Domain.Entity;
using Api.Domain.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Application
{
    public class UsuarioService
    {
        private readonly IUsuarioRepository _repo;

        public UsuarioService(IUsuarioRepository repo)
        {
            _repo = repo;
        }

        public async Task CrearUsuario(Usuario usuario)
        {
            await _repo.Crear(usuario);
        }

        public async Task<Usuario> Login(string correo)
        {
            return await _repo.ObtenerPorCorreo(correo);
        }
    }
}
