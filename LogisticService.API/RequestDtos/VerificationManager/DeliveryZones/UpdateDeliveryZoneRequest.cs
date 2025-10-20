namespace LogisticService.API.RequestDtos.VerificationManager.DeliveryZones
{
    public class UpdateDeliveryZoneRequest
    {
        public int Id { get; set; }
        public string ZoneName { get; set; } = string.Empty;
        public string? ZoneDescription { get; set; }
    }
}
