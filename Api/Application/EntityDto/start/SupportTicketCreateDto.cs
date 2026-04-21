namespace Api.Application.EntityDto
{
    public record SupportTicketCreateDto(
        int ProfileId,
        string Subject,
        int PriorityId
    );
}