using Api.Application.EntityDto;
using Api.Application.Service;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SupportTicketController : ControllerBase
    {
        private readonly SupportTicketService _service;

        public SupportTicketController(SupportTicketService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<SupportTicketResponseDto>>> Get()
            => Ok(await _service.GetAll());

        [HttpPost]
        public async Task<IActionResult> Post(SupportTicketCreateDto dto)
        {
            await _service.CreateTicket(dto);
            return Ok(new { message = "Support ticket created successfully" });
        }
    }
}