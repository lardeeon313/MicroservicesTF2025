namespace LogisticService.API.RequestDtos.DeliveryTeams
{
    public class CreateDeliveryTeamRequest
    {
        public string TeamName { get; set; } = string.Empty;
        public string? TeamDescription { get; set; }
    }
}
