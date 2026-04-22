using Api.Domain.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.ValueObjects;
using Api.Domain.Entities;

namespace Api.Application.Service
{
    public class RouteService
    {
        private readonly IRouteRepository _repository;

        public RouteService(IRouteRepository repository)
        {
            _repository = repository;
        }

        public async Task CreateRoute(RouteCreateDto dto)
        {
            var points = JsonSerializer.Deserialize<List<Coordinates>>(dto.PathJson);

            var route = new Route
            {
                Name = new RouteName(dto.Name),
                Description = dto.Description,
                Path = new RoutePath(points),
                DistanceKm = new Distance((decimal)dto.DistanceKm),
                EstimatedTime = new TimeValue(dto.EstimatedMinutes),
                CreatedBy = dto.CreatedBy,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.CreateAsync(route);
        }

        public async Task<List<RouteResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();

            return list.Select(x => new RouteResponseDto(
                x.Name.Value,
                x.Description,
                JsonSerializer.Serialize(x.Path.Points),
                (double)x.DistanceKm.Value,
                x.EstimatedTime.Value,
                x.CreatedBy,
                x.CreatedAt,
                x.Active 
            )).ToList();
        }
    }
}