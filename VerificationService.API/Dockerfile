FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["VerificationService.API/VerificationService.API.csproj", "VerificationService.API/"]
RUN dotnet restore "VerificationService.API/VerificationService.API.csproj"

COPY . .
WORKDIR "/src/VerificationService.API"
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "VerificationService.API.dll"]
