namespace Api.Application.DTO.InputDTO
{
    public record SessionCreateDto(
            int UserId,
            string IpAddress 
     );
}
