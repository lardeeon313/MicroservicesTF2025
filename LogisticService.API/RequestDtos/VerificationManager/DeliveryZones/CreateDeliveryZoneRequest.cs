namespace LogisticService.API.RequestDtos.VerificationManager.DeliveryZones
{
    public class CreateDeliveryZoneRequest
    {
        public string ZoneName { get; set; } = string.Empty;
        public string? ZoneDescription { get; set; }
    }
}
