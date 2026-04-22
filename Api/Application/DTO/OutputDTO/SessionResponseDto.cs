using System;

namespace Api.Application.DTO.OutputDTO
{
    public record SessionResponseDto(
        int UserId,
        DateTime StartDate,
        DateTime? EndDate,
        string IpAddress,
        bool Active
    );
}