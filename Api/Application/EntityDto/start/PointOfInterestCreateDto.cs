namespace Api.Application.EntityDto
{
    public record PointOfInterestCreateDto(
        string Name,
        int CategoryId,
        double Latitude,
        double Longitude,
        string Address,
        int CreatedBy
    );
}