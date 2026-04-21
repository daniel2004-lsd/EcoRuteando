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
    public class UserRoleController : ControllerBase
    {
        private readonly UserRoleService _service;

        public UserRoleController(UserRoleService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<UserRoleResponseDto>>> Get()
        {
            var result = await _service.GetAll();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Post(UserRoleCreateDto dto)
        {
            await _service.AssignRole(dto);
            return Ok(new { mensaje = "Role asignado al usuario correctamente" });
        }
    }
}