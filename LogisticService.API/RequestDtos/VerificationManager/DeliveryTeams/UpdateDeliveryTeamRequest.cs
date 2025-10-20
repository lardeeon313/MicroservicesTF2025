namespace LogisticService.API.RequestDtos.VerificationManager.DeliveryTeams
{
    public class UpdateDeliveryTeamRequest
    {
        public int Id { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public string? TeamDescription { get; set; }
    }
}
