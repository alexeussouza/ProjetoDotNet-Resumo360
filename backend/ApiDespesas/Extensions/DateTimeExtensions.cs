namespace ApiDespesas.Extensions
{
    public static class DateTimeExtensions
    {
        public static DateTime EnsureUtc(this DateTime dateTime)
        {
            return dateTime.Kind == DateTimeKind.Utc
                ? dateTime
                : DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
        }
    }
}
