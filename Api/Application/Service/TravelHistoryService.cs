using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain;
using Api.Domain.Entities;
using Api.Domain.Interface;
using Api.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class TravelHistoryService
    {
        private readonly ITravelHistoryRepository _repository;

        public TravelHistoryService(ITravelHistoryRepository repository)
        {
            _repository = repository;
        }

        public async Task RegisterTrip(TravelHistoryCreateDto dto)
        {
            var history = new TravelHistory
            {
                ProfileId = dto.ProfileId,
                RouteId = dto.RouteId,
                CO2SavedKg = new CO2((decimal)dto.CO2Saved),
                TimeRange = new TimeRange(
                    DateTime.UtcNow.AddSeconds(-dto.TotalSeconds),
                    DateTime.UtcNow
                ),
                IsCompleted = dto.IsCompleted
            };

            await _repository.CreateAsync(history);
        }

        public async Task<List<TravelHistoryResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();

            return list.Select(x => new TravelHistoryResponseDto(
                x.ProfileId,
                x.RouteId,
                (double)x.CO2SavedKg.Value,
                x.TimeRange.ToString(),
                x.IsCompleted,
                x.Active 
            )).ToList();
        }
    }
}