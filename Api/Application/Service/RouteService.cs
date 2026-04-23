using AutoMapper;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class RouteService
    {
        private readonly IRouteRepository _repository;
        private readonly IMapper _mapper;

        public RouteService(IRouteRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task CreateRoute(RouteCreateDto dto)
        {
            var route = _mapper.Map<Route>(dto);
            route.CreatedAt = System.DateTime.UtcNow;

            await _repository.CreateAsync(route);
        }

        public async Task<List<RouteResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();
            return _mapper.Map<List<RouteResponseDto>>(list);
        }
    }
}