using AutoMapper;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class PointOfInterestService
    {
        private readonly IPointOfInterestRepository _repository;
        private readonly IMapper _mapper;

        public PointOfInterestService(IPointOfInterestRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task CreatePointOfInterest(PointOfInterestCreateDto dto)
        {
            var point = _mapper.Map<PointOfInterest>(dto);
            await _repository.CreateAsync(point);
        }

        public async Task<List<PointOfInterestResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();
            return _mapper.Map<List<PointOfInterestResponseDto>>(list);
        }
    }
}