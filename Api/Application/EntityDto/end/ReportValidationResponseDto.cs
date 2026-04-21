using System;

namespace Api.Application.EntityDto
{
    public record ReportValidationResponseDto(
        int ProfileId,
        int ReportId,
        string Result,
        DateTime VotedAt,
        bool Active
    );
}