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
    public class ConfigurationController : ControllerBase
    {
        private readonly ConfigurationService _service;

        public ConfigurationController(ConfigurationService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<ConfigurationResponseDto>>> Get()
            => Ok(await _service.GetAll());

        [HttpPost]
        public async Task<IActionResult> Post(ConfigurationCreateDto dto)
        {
            await _service.CreateConfiguration(dto);
            return Ok(new { mensaje = "Configuración guardada" });
        }
    }
}