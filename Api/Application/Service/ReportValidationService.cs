using AutoMapper;
using Api.Application.DTO.InputDTO;
using Api.Application.DTO.OutputDTO;
using Api.Domain.Entities;
using Api.Domain.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Service
{
    public class ReportValidationService
    {
        private readonly IReportValidationRepository _repository;
        private readonly IMapper _mapper;

        public ReportValidationService(IReportValidationRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task Validate(ReportValidationCreateDto dto)
        {
            var validation = _mapper.Map<ReportValidation>(dto);
            validation.VotedAt = System.DateTime.UtcNow;

            await _repository.CreateAsync(validation);
        }

        public async Task<List<ReportValidationResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();
            return _mapper.Map<List<ReportValidationResponseDto>>(list);
        }
    }
}