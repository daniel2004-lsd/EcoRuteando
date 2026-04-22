namespace Api.Application.DTO.InputDTO
{
    public record ReportValidationCreateDto(
        int ProfileId,
        int ReportId,
        int ConfirmationStatusId
    );
}