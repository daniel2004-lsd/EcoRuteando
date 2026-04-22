using System;

namespace Api.Application.DTO.OutputDTO
{
    public record ReportValidationResponseDto(
        int ProfileId,
        int ReportId,
        string Result,
        DateTime VotedAt,
        bool Active
    );
}