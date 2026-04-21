using System;

namespace Api.Application.EntityDto.end
{
    public record SessionResponseDto(
        int UserId,
        DateTime StartDate,
        DateTime? EndDate,
        string IpAddress,
        bool Active
    );
}