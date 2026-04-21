using Api.Application.EntityDto;
using Api.Application.Service;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ObstacleReportController : ControllerBase
    {
        private readonly ObstacleReportService _service;

        public ObstacleReportController(ObstacleReportService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<ObstacleReportResponseDto>>> Get()
            => Ok(await _service.GetAll());

        [HttpPost]
        public async Task<IActionResult> Post(ObstacleReportCreateDto dto)
        {
            await _service.CreateReport(dto);
            return Ok(new { mensaje = "Reporte de obstáculo creado exitosamente" });
        }
    }
}