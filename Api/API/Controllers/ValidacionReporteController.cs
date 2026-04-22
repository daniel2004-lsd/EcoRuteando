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
    public class ReportValidationController : ControllerBase
    {
        private readonly ReportValidationService _service;

        public ReportValidationController(ReportValidationService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<ReportValidationResponseDto>>> Get()
            => Ok(await _service.GetAll());

        [HttpPost]
        public async Task<IActionResult> Post(ReportValidationCreateDto dto)
        {
            await _service.Validate(dto);
            return Ok(new { mensaje = "Validación registrada correctamente" });
        }
    }
}