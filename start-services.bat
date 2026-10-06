@echo off
echo ===================================================
echo Starting Library Management Microservices System
echo ===================================================

echo [1/4] Launching Auth Service on Port 5001...
start "LibraryManagement - Auth Service (:5001)" cmd /k "dotnet run --project services\AuthService\LibraryManagement.Services.Auth.csproj"

echo [2/5] Launching Catalog Service on Port 5002...
start "LibraryManagement - Catalog Service (:5002)" cmd /k "dotnet run --project services\CatalogService\LibraryManagement.Services.Catalog.csproj"

echo [3/5] Launching Borrowing Service on Port 5003...
start "LibraryManagement - Borrowing Service (:5003)" cmd /k "dotnet run --project services\BorrowingService\LibraryManagement.Services.Borrowing.csproj"

timeout /t 3 /nobreak >nul

echo [4/5] Launching API Gateway on Port 5281...
start "LibraryManagement - API Gateway (:5281)" cmd /k "dotnet run --project services\Gateway\LibraryManagement.Gateway.csproj"

echo [5/5] Launching Frontend UI on Port 5173...
start "LibraryManagement - Frontend (:5173)" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo Microservices Status:
echo - Frontend App:        http://localhost:5173
echo - API Gateway:         http://localhost:5281
echo - Auth Service:        http://localhost:5001/swagger
echo - Catalog Service:     http://localhost:5002/swagger
echo - Borrowing Service:   http://localhost:5003/swagger
echo ===================================================
echo Press any key to exit this launcher window (services keep running).
pause >nul
