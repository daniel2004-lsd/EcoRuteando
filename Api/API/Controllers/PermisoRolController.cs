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
    public class PermisoRolController : ControllerBase
    {
        private readonly RolePermissionService _service;

        public PermisoRolController(RolePermissionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<RolePermissionResponseDto>>> Get()
        {
            var result = await _service.GetAll();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Post(RolePermissionCreateDto dto)
        {
            await _service.AssignPermission(dto);
            return Ok(new { message = "Permission assigned to role successfully" });
        }
    }
}