FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["SalesService.API/SalesService.API.csproj", "SalesService.API/"]
COPY ["SalesService.Application/SalesService.Application.csproj", "SalesService.Application/"]
COPY ["SalesService.Domain/SalesService.Domain.csproj", "SalesService.Domain/"]
COPY ["SalesService.Infraestructure/SalesService.Infraestructure.csproj", "SalesService.Infraestructure/"]

RUN dotnet restore SalesService.API/SalesService.API.csproj

# Ahora copiamos TODO
COPY . .

# Build y publish
WORKDIR /src/SalesService.API
RUN dotnet build --configuration Release --verbosity:minimal
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SalesService.API.dll"]

