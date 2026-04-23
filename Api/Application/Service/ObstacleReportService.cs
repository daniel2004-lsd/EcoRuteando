using AutoMapper;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class ObstacleReportService
    {
        private readonly IObstacleReportRepository _repository;
        private readonly IMapper _mapper;

        public ObstacleReportService(IObstacleReportRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task CreateReport(ObstacleReportCreateDto dto)
        {
            var report = _mapper.Map<ObstacleReport>(dto);
            report.CreatedAt = System.DateTime.UtcNow;

            await _repository.CreateAsync(report);
        }

        public async Task<List<ObstacleReportResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();
            return _mapper.Map<List<ObstacleReportResponseDto>>(list);
        }
    }
}