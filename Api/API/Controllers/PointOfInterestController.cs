using Api.Application.EntityDto;
using Api.Application.Service;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PointOfInterestController : ControllerBase
    {
        private readonly PointOfInterestService _service;

        public PointOfInterestController(PointOfInterestService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<PointOfInterestResponseDto>>> Get()
            => Ok(await _service.GetAll());

        [HttpPost]
        public async Task<IActionResult> Post(PointOfInterestCreateDto dto)
        {
            // CORRECCIÓN: El método en tu Service se llama CreatePointOfInterest
            await _service.CreatePointOfInterest(dto);

            return Ok(new { mensaje = "Punto de interés creado correctamente" });
        }
    }
}