namespace IdentityService.API.RequestsDtos
{
    public class CreateNewPasswordRequest
    {
        public string UserIdentityId { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }
}
