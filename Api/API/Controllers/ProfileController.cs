using Api.Application.EntityDto;
using Api.Application.EntityDto.end;
using Api.Application.EntityDto.start;
using Api.Application.Service;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly ProfileService _service;

        public ProfileController(ProfileService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProfileResponseDto>>> Get()
            => Ok(await _service.GetAll());

        [HttpPost]
        public async Task<IActionResult> Post(ProfileCreateDto dto)
        {
            await _service.CreateProfile(dto);
            return Ok(new { mensaje = "Perfil creado con éxito" });
        }
    }
}