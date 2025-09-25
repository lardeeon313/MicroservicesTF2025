FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["LogisticService.API/LogisticService.API.csproj", "LogisticService.API/"]
RUN dotnet restore "./LogisticService.API/LogisticService.API.csproj"

COPY . .
WORKDIR "/src/LogisticService.API"
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "LogisticService.API.dll"]
