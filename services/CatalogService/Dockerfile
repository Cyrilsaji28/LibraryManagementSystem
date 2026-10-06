FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 5002

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["services/CatalogService/LibraryManagement.Services.Catalog.csproj", "services/CatalogService/"]
COPY ["services/Shared/LibraryManagement.Shared.csproj", "services/Shared/"]
RUN dotnet restore "services/CatalogService/LibraryManagement.Services.Catalog.csproj"
COPY services/CatalogService/ services/CatalogService/
COPY services/Shared/ services/Shared/
WORKDIR "/src/services/CatalogService"
RUN dotnet build "LibraryManagement.Services.Catalog.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LibraryManagement.Services.Catalog.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LibraryManagement.Services.Catalog.dll"]
