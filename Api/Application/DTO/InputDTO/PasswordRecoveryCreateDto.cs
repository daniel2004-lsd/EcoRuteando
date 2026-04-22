using System;

namespace Api.Application.DTO.InputDTO
{
    public record PasswordRecoveryCreateDto(
        int UserId,
        string Code,
        DateTime ExpirationDate
    );
}