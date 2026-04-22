namespace Api.Application.DTO.InputDTO
{
    public record ObstacleReportCreateDto(
        int ProfileId,
        int TypeId,
        string Description,
        double Latitude,
        double Longitude,
        string PhotoUrl
    );
}