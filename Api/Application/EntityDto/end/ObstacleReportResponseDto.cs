using System;

namespace Api.Application.EntityDto
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