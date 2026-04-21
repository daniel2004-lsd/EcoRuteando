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
    public class SessionController : ControllerBase
    {
        private readonly SessionService _sessionService;

        public SessionController(SessionService sessionService)
        {
            _sessionService = sessionService;
        }

        [HttpGet]
        public async Task<ActionResult<List<SessionResponseDto>>> Get()
        {
            return Ok(await _sessionService.GetAll());
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] SessionCreateDto dto)
        {
            await _sessionService.CreateSession(dto);
            return Ok(new { message = "Session registered successfully" });
        }
    }
}