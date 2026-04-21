using Api.Application.EntityDto;
using Api.Application.Service;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteReviewController : ControllerBase
    {
        private readonly RouteReviewService _service;

        public RouteReviewController(RouteReviewService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<RouteReviewResponseDto>>> Get()
            => Ok(await _service.GetAll());

        [HttpPost]
        public async Task<IActionResult> Post(RouteReviewCreateDto dto)
        {
            await _service.CreateReview(dto);
            return Ok(new { mensaje = "Reseña publicada con éxito" });
        }
    }
}