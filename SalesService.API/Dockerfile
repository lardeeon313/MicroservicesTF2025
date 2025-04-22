FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["SalesService.API/SalesService.API.csproj", "SalesService.API/"]
RUN dotnet restore "SalesService.API/SalesService.API.csproj"

COPY . .
WORKDIR "/src/SalesService.API"
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SalesService.API.dll"]
