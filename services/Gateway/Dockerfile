FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 5281

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["services/Gateway/LibraryManagement.Gateway.csproj", "services/Gateway/"]
RUN dotnet restore "services/Gateway/LibraryManagement.Gateway.csproj"
COPY services/Gateway/ services/Gateway/
WORKDIR "/src/services/Gateway"
RUN dotnet build "LibraryManagement.Gateway.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LibraryManagement.Gateway.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LibraryManagement.Gateway.dll"]
