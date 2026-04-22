using Api.Domain.Interface;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Api.Domain.Enums;
using Api.Application.DTO.OutputDTO;
using Api.Application.DTO.InputDTO;
using Api.Domain.Entities;

namespace Api.Application.Service
{
    public class ReportValidationService
    {
        private readonly IReportValidationRepository _repository;

        public ReportValidationService(IReportValidationRepository repository)
        {
            _repository = repository;
        }

        public async Task Validate(ReportValidationCreateDto dto)
        {
            var validation = new ReportValidation
            {
                ProfileId = dto.ProfileId,
                ReportId = dto.ReportId,
                ConfirmationStatus = (ConfirmationStatus)dto.ConfirmationStatusId,
                VotedAt = DateTime.UtcNow
            };

            await _repository.CreateAsync(validation);
        }

        public async Task<List<ReportValidationResponseDto>> GetAll()
        {
            var list = await _repository.GetAllAsync();

            return list.Select(x => new ReportValidationResponseDto(
                x.ProfileId,
                x.ReportId,
                x.ConfirmationStatus.ToString(),
                x.VotedAt,
                x.Active
            )).ToList();
        }
    }
}