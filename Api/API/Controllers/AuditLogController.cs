using Api.Application.EntityDto;
using Api.Application.Service;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuditLogController : ControllerBase
    {
        private readonly AuditLogService _service;

        public AuditLogController(AuditLogService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<AuditLogResponseDto>>> Get()
            => Ok(await _service.GetAll());

        [HttpPost]
        public async Task<IActionResult> Post(AuditLogCreateDto dto)
        {
            await _service.Register(dto);
            return Ok(new { mensaje = "Registro de auditoría guardado" });
        }
    }
}