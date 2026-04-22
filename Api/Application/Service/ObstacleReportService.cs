using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Enums;
using Api.Domain.Interface;
using Api.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class ObstacleReportService
    {
        private readonly IObstacleReportRepository _repository;

        public ObstacleReportService(IObstacleReportRepository repository)
        {
            _repository = repository;
        }

        public async Task CreateReport(ObstacleReportCreateDto dto)
        {
            var report = new ObstacleReport
            {
                ProfileId = dto.ProfileId,
                Type = (ObstacleType)dto.TypeId,
                Description = dto.Description,
                Location = new Coordinates(dto.Latitude, dto.Longitude),
                PhotoUrl = new UrlImagen(dto.PhotoUrl),
                CreatedAt = DateTime.UtcNow
            };

            await _repository.CreateAsync(report);
        }

        public async Task<List<ObstacleReportResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();

            return list.Select(x => new ObstacleReportResponseDto(
                x.ProfileId,
                x.Type.ToString(), 
                x.Description,
                x.Location.Latitude,
                x.Location.Longitude,
                x.PhotoUrl.Value,
                x.CreatedAt,
                x.Active 
            )).ToList();
        }
    }
}