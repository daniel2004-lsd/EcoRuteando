namespace Api.Application.DTO.InputDTO
{
    public record SupportTicketCreateDto(
        int ProfileId,
        string Subject,
        int PriorityId
    );
}