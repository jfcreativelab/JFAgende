@echo off
echo ============================================
echo   JFAgende - Helper de Deploy
echo ============================================
echo.

:menu
echo Escolha uma opcao:
echo.
echo [1] Preparar para primeiro deploy (Git init)
echo [2] Fazer commit e push (atualizar online)
echo [3] Ver status do Git
echo [4] Abrir Railway.app
echo [5] Abrir Vercel.com
echo [6] Ver guia de deploy
echo [0] Sair
echo.
set /p choice="Digite o numero: "

if "%choice%"=="1" goto init
if "%choice%"=="2" goto commit
if "%choice%"=="3" goto status
if "%choice%"=="4" goto railway
if "%choice%"=="5" goto vercel
if "%choice%"=="6" goto guide
if "%choice%"=="0" goto end
goto menu

:init
echo.
echo Inicializando repositorio Git...
git init
git add .
git commit -m "Initial commit - JFAgende App"
echo.
echo Pronto! Agora crie um repositorio no GitHub:
echo https://github.com/new
echo.
echo Depois rode:
echo git remote add origin https://github.com/SEU_USUARIO/jfagende.git
echo git branch -M main
echo git push -u origin main
echo.
pause
goto menu

:commit
echo.
set /p msg="Descricao das mudancas: "
echo.
echo Fazendo commit...
git add .
git commit -m "%msg%"
echo.
echo Enviando para GitHub (isso vai atualizar Railway e Vercel automaticamente)...
git push origin main
echo.
echo Pronto! Deploy iniciado automaticamente!
echo.
pause
goto menu

:status
echo.
echo Status do Git:
echo.
git status
echo.
pause
goto menu

:railway
echo.
echo Abrindo Railway.app...
start https://railway.app
goto menu

:vercel
echo.
echo Abrindo Vercel.com...
start https://vercel.com
goto menu

:guide
echo.
echo Abrindo guia de deploy...
start DEPLOY-RAPIDO.md
goto menu

:end
echo.
echo Ate logo!
exit

