namespace Api.Application.EntityDto
{
    public record ReportValidationCreateDto(
        int ProfileId,
        int ReportId,
        int ConfirmationStatusId
    );
}