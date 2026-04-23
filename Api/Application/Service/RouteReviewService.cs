using AutoMapper;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class RouteReviewService
    {
        private readonly IRouteReviewRepository _repository;
        private readonly IMapper _mapper;

        public RouteReviewService(IRouteReviewRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task CreateReview(RouteReviewCreateDto dto)
        {
            var review = _mapper.Map<RouteReview>(dto);
            review.CreatedAt = System.DateTime.UtcNow;

            await _repository.CreateAsync(review);
        }

        public async Task<List<RouteReviewResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();
            return _mapper.Map<List<RouteReviewResponseDto>>(list);
        }
    }
}