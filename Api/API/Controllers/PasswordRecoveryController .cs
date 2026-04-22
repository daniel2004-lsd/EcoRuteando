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
    public class PasswordRecoveryController : ControllerBase
    {
        private readonly PasswordRecoveryService _service;

        public PasswordRecoveryController(PasswordRecoveryService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<PasswordRecoveryResponseDto>>> Get()
            => Ok(await _service.GetAll());

        [HttpPost]
        public async Task<IActionResult> Post(PasswordRecoveryCreateDto dto)
        {
            await _service.CreateRequest(dto);
            return Ok(new { mensaje = "Solicitud de recuperación generada" });
        }
    }
}