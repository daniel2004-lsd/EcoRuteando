using System;

namespace Api.Application.DTO.OutputDTO
{
    public record RouteResponseDto(
        string Name,
        string Description,
        string Path,
        double DistanceKm,
        int DurationMinutes,
        int CreatedBy,
        DateTime CreatedAt,
        bool Active
    );
}