-- CreateTable
CREATE TABLE "planos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" REAL NOT NULL DEFAULT 0,
    "limiteAgendamentos" INTEGER NOT NULL,
    "limiteAgendamentosDia" INTEGER,
    "permitePortfolio" BOOLEAN NOT NULL DEFAULT false,
    "permiteRelatorios" BOOLEAN NOT NULL DEFAULT false,
    "permiteDestaque" BOOLEAN NOT NULL DEFAULT false,
    "diasDestaque" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "assinaturas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "estabelecimentoId" TEXT NOT NULL,
    "planoId" TEXT NOT NULL,
    "dataInicio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFim" DATETIME,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "autoRenovar" BOOLEAN NOT NULL DEFAULT false,
    "destaqueAte" DATETIME,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "assinaturas_estabelecimentoId_fkey" FOREIGN KEY ("estabelecimentoId") REFERENCES "estabelecimentos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "assinaturas_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "planos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lembretes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agendamentoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "dataEnvio" DATETIME NOT NULL,
    "enviado" BOOLEAN NOT NULL DEFAULT false,
    "dataEnviado" DATETIME,
    "erro" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "lembretes_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES "agendamentos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "assinaturas_estabelecimentoId_key" ON "assinaturas"("estabelecimentoId");
