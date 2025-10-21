@echo off
echo ========================================
echo Iniciando JFAgende
echo ========================================
echo.

echo [1/2] Iniciando Backend (porta 5000)...
cd backend
start "JFAgende Backend" cmd /k "npm start"
timeout /t 3 /nobreak > nul
echo Backend iniciado!
echo.

echo [2/2] Iniciando Frontend (porta 3000)...
cd ..\frontend
start "JFAgende Frontend" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul
echo Frontend iniciado!
echo.

echo ========================================
echo JFAgende esta rodando!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Pressione qualquer tecla para fechar...
pause > nul

