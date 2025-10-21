@echo off
echo ============================================
echo   Testando Database - JFAgende
echo ============================================
echo.

echo Abrindo Prisma Studio na porta 5555...
echo Acesse: http://localhost:5555
echo.
echo Pressione Ctrl+C para fechar.
echo.

cd backend
npx prisma studio --port 5555

