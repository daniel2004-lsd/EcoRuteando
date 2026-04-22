using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Application.Service;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteController : ControllerBase
    {
        private readonly RouteService _service;

        public RouteController(RouteService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<RouteResponseDto>>> Get()
            => Ok(await _service.GetAll());

        [HttpPost]
        public async Task<IActionResult> Post(RouteCreateDto dto)
        {
            await _service.CreateRoute(dto);
            return Ok(new { mensaje = "Ruta guardada exitosamente" });
        }
    }
}