-- Adicionar campo chavePix na tabela estabelecimentos
ALTER TABLE "estabelecimentos" ADD COLUMN "chavePix" TEXT;

-- Adicionar campos de pagamento na tabela agendamentos
ALTER TABLE "agendamentos" ADD COLUMN "pagamentoAntecipado" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "agendamentos" ADD COLUMN "comprovantePix" TEXT;
ALTER TABLE "agendamentos" ADD COLUMN "valorTaxa" DOUBLE PRECISION;
ALTER TABLE "agendamentos" ADD COLUMN "valorTotal" DOUBLE PRECISION;
