using AutoMapper;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class TravelHistoryService
    {
        private readonly ITravelHistoryRepository _repository;
        private readonly IMapper _mapper;

        public TravelHistoryService(ITravelHistoryRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task RegisterTrip(TravelHistoryCreateDto dto)
        {
            var history = _mapper.Map<TravelHistory>(dto);
            await _repository.CreateAsync(history);
        }

        public async Task<List<TravelHistoryResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();
            return _mapper.Map<List<TravelHistoryResponseDto>>(list);
        }
    }
}