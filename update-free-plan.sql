-- Script SQL para atualizar o plano FREE
-- Atualiza os limites do plano FREE conforme especificado

UPDATE planos 
SET 
  "limiteAgendamentos" = 110,
  "limiteAgendamentosDia" = 5,
  "permitePortfolio" = false,
  "permiteRelatorios" = false,
  "permiteDestaque" = false,
  "diasDestaque" = 0
WHERE nome = 'FREE';

-- Verificar se a atualização foi bem-sucedida
SELECT 
  nome,
  "limiteAgendamentos",
  "limiteAgendamentosDia",
  "permitePortfolio",
  "permiteRelatorios",
  "permiteDestaque",
  "diasDestaque"
FROM planos 
WHERE nome = 'FREE';
