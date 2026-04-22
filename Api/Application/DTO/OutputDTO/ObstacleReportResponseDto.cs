using System;

namespace Api.Application.DTO.OutputDTO
{
    public record ObstacleReportResponseDto(
        int ProfileId,
        string Type,
        string Description,
        double Latitude,
        double Longitude,
        string PhotoUrl,
        DateTime CreatedAt,
        bool Active = true
    );
}