FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["DeliveryService.API/DeliveryService.API.csproj", "DeliveryService.API/"]
RUN dotnet restore "DeliveryService.API/DeliveryService.API.csproj"

COPY . .
WORKDIR "/src/DeliveryService.API"
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "DeliveryService.API.dll"]
