using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using Api.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class RouteReviewService
    {
        private readonly IRouteReviewRepository _repository;

        public RouteReviewService(IRouteReviewRepository repository)
        {
            _repository = repository;
        }

        public async Task CreateReview(RouteReviewCreateDto dto)
        {
            var review = new RouteReview
            {
                ProfileId = dto.ProfileId,
                RouteId = dto.RouteId,
                Rating = new Rating(dto.Rating),
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.CreateAsync(review);
        }

        public async Task<List<RouteReviewResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();

            return list.Select(x => new RouteReviewResponseDto(
                x.Id,
                x.ProfileId,
                x.RouteId,
                x.Rating.Value,
                x.Comment,
                x.CreatedAt,
                x.Active
            )).ToList();
        }
    }
}