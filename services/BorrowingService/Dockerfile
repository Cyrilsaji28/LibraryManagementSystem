FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 5003

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["services/BorrowingService/LibraryManagement.Services.Borrowing.csproj", "services/BorrowingService/"]
COPY ["services/Shared/LibraryManagement.Shared.csproj", "services/Shared/"]
RUN dotnet restore "services/BorrowingService/LibraryManagement.Services.Borrowing.csproj"
COPY services/BorrowingService/ services/BorrowingService/
COPY services/Shared/ services/Shared/
WORKDIR "/src/services/BorrowingService"
RUN dotnet publish "LibraryManagement.Services.Borrowing.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "LibraryManagement.Services.Borrowing.dll"]
