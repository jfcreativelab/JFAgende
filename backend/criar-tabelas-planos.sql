-- Criar tabela planos_estabelecimento
CREATE TABLE IF NOT EXISTS "planos_estabelecimento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "estabelecimentoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "cor" TEXT NOT NULL,
    "icone" TEXT NOT NULL,
    "servicos" TEXT[] NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "planos_estabelecimento_estabelecimentoId_fkey" FOREIGN KEY ("estabelecimentoId") REFERENCES "estabelecimentos"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Criar tabela assinaturas_plano
CREATE TABLE IF NOT EXISTS "assinaturas_plano" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clienteId" TEXT NOT NULL,
    "planoEstabelecimentoId" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFim" TIMESTAMP(3),
    "cortesUtilizados" INTEGER NOT NULL DEFAULT 0,
    "barbasUtilizadas" INTEGER NOT NULL DEFAULT 0,
    "servicosUtilizados" JSONB,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "assinaturas_plano_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "assinaturas_plano_planoEstabelecimentoId_fkey" FOREIGN KEY ("planoEstabelecimentoId") REFERENCES "planos_estabelecimento"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "assinaturas_plano_clienteId_planoEstabelecimentoId_dataInicio_key" UNIQUE ("clienteId", "planoEstabelecimentoId", "dataInicio")
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS "planos_estabelecimento_estabelecimentoId_idx" ON "planos_estabelecimento"("estabelecimentoId");
CREATE INDEX IF NOT EXISTS "planos_estabelecimento_ativo_idx" ON "planos_estabelecimento"("ativo");
CREATE INDEX IF NOT EXISTS "assinaturas_plano_clienteId_idx" ON "assinaturas_plano"("clienteId");
CREATE INDEX IF NOT EXISTS "assinaturas_plano_planoEstabelecimentoId_idx" ON "assinaturas_plano"("planoEstabelecimentoId");
CREATE INDEX IF NOT EXISTS "assinaturas_plano_ativo_idx" ON "assinaturas_plano"("ativo");
