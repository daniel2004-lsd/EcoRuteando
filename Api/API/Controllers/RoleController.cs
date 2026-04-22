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
    public class RoleController : ControllerBase
    {
        private readonly RoleService _roleService;

        public RoleController(RoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        public async Task<ActionResult<List<RoleResponseDto>>> Get()
            => Ok(await _roleService.GetAll());

        [HttpPost]
        public async Task<IActionResult> Post(RoleCreateDto dto)
        {
            await _roleService.CreateRole(dto);
            return Ok(new { mensaje = "Role creado con éxito" });
        }
    }
}