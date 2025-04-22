FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["IdentityService.API/IdentityService.API.csproj", "IdentityService.API/"]
RUN dotnet restore "IdentityService.API/IdentityService.API.csproj"

COPY . .
WORKDIR "/src/IdentityService.API"
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "IdentityService.API.dll"]
