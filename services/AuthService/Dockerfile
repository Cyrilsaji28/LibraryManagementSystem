FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 5001

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["services/AuthService/LibraryManagement.Services.Auth.csproj", "services/AuthService/"]
COPY ["services/Shared/LibraryManagement.Shared.csproj", "services/Shared/"]
RUN dotnet restore "services/AuthService/LibraryManagement.Services.Auth.csproj"
COPY services/AuthService/ services/AuthService/
COPY services/Shared/ services/Shared/
WORKDIR "/src/services/AuthService"
RUN dotnet build "LibraryManagement.Services.Auth.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LibraryManagement.Services.Auth.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LibraryManagement.Services.Auth.dll"]
