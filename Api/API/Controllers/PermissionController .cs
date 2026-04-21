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
    public class PermissionController : ControllerBase
    {
        private readonly PermissionService _permissionService;

        public PermissionController(PermissionService permissionService)
        {
            _permissionService = permissionService;
        }

        [HttpGet]
        public async Task<ActionResult<List<PermissionResponseDto>>> Get()
            => Ok(await _permissionService.GetAll());

        [HttpPost]
        public async Task<IActionResult> Post(PermissionCreateDto dto)
        {
            await _permissionService.CreatePermission(dto);
            return Ok(new { mensaje = "Permiso creado" });
        }
    }
}