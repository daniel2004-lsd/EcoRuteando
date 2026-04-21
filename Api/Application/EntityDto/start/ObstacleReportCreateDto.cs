namespace Api.Application.EntityDto
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