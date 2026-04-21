namespace Api.Application.EntityDto
{
    public record PointOfInterestResponseDto(
        string Name,
        string Category,
        double Latitude,
        double Longitude,
        string Address,
        int CreatedBy,
        bool Active
    );
}