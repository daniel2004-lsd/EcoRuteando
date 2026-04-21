using Api.Application.EntityDto;
using Api.Domain.Entity;
using Api.Domain.Entity.Enums;
using Api.Domain.Entity.ValueObjects;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class PointOfInterestService
    {
        private readonly IPointOfInterestRepository _repository;

        public PointOfInterestService(IPointOfInterestRepository repository)
        {
            _repository = repository;
        }

        public async Task CreatePointOfInterest(PointOfInterestCreateDto dto)
        {
            var point = new PointOfInterest
            {
                Name = new PlaceName(dto.Name),
                Category = (PointCategory)dto.CategoryId,
                Location = new Coordinates(dto.Latitude, dto.Longitude),
                Address = dto.Address,
                CreatedBy = dto.CreatedBy
            };

            await _repository.CreateAsync(point);
        }

        public async Task<List<PointOfInterestResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();

            return list.Select(x => new PointOfInterestResponseDto(
                x.Name.Value, 
                x.Category.ToString(),
                x.Location.Latitude,
                x.Location.Longitude,
                x.Address,
                x.CreatedBy,
                x.Active
            )).ToList();
        }
    }
}