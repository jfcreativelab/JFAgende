-- CreateTable
CREATE TABLE "bloqueios_horarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "estabelecimentoId" TEXT NOT NULL,
    "dataInicio" DATETIME NOT NULL,
    "dataFim" DATETIME NOT NULL,
    "motivo" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bloqueios_horarios_estabelecimentoId_fkey" FOREIGN KEY ("estabelecimentoId") REFERENCES "estabelecimentos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
