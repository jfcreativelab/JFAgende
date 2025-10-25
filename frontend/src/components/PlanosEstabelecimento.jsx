import React, { useState, useEffect } from 'react';
import { Crown, Star, Zap, Gem, Check, Calendar, Clock, Scissors } from 'lucide-react';
import planoEstabelecimentoService from '../services/planoEstabelecimentoService';

const PlanosEstabelecimento = ({ estabelecimentoId }) => {
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Planos padrão para barbearias
  const planosPadrao = [
    {
      id: 'bronze',
      nome: 'Bronze',
      descricao: 'Ideal para quem quer estar sempre no estilo, sem pagar toda vez.',
      preco: 80,
      cor: 'from-amber-600 to-amber-800',
      icone: Crown,
      servicos: [
        '2 cortes de cabelo por mês',
        'Limpeza de sobrancelha'
      ],
      popular: false
    },
    {
      id: 'prata',
      nome: 'Prata',
      descricao: 'Perfeito para quem gosta de estar alinhado toda semana.',
      preco: 120,
      cor: 'from-gray-400 to-gray-600',
      icone: Star,
      servicos: [
        '2 cortes de cabelo + 2 barbas por mês',
        'Limpeza de sobrancelha',
        'Hidratante facial ou esfoliação (1x por mês)'
      ],
      popular: true
    },
    {
      id: 'ouro',
      nome: 'Ouro',
      descricao: 'Para o cliente exigente que quer tratamento completo.',
      preco: 180,
      cor: 'from-yellow-500 to-yellow-700',
      icone: Zap,
      servicos: [
        '4 cortes de cabelo (1 por semana)',
        '4 barbas',
        'Hidratação capilar + massagem facial',
        'Limpeza de sobrancelha'
      ],
      popular: false
    },
    {
      id: 'diamante',
      nome: 'Diamante',
      descricao: 'Plano exclusivo para clientes fiéis e que valorizam conforto e status.',
      preco: 280,
      cor: 'from-blue-500 to-purple-600',
      icone: Gem,
      servicos: [
        'Cortes e barbas ilimitados',
        'Limpeza de sobrancelha',
        'Hidratação + esfoliação facial'
      ],
      popular: false
    }
  ];

  useEffect(() => {
    carregarPlanos();
  }, [estabelecimentoId]);

  const carregarPlanos = async () => {
    try {
      setLoading(true);
      const planosData = await planoEstabelecimentoService.getPlanosByEstabelecimento(estabelecimentoId);
      
      if (planosData.length === 0) {
        // Se não há planos, criar planos padrão
        await planoEstabelecimentoService.criarPlanosPadrao(estabelecimentoId);
        const novosPlanos = await planoEstabelecimentoService.getPlanosByEstabelecimento(estabelecimentoId);
        setPlanos(novosPlanos);
      } else {
        setPlanos(planosData);
      }
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      // Em caso de erro, usar planos padrão
      setPlanos(planosPadrao);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          💈 Planos Mensais
        </h2>
        <p className="text-gray-600 text-lg">
          Escolha o plano ideal para manter seu estilo sempre em dia
        </p>
      </div>

      {/* Planos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {planos.map((plano) => {
          const IconComponent = plano.icone;
          return (
            <div
              key={plano.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                plano.popular 
                  ? 'border-purple-500 ring-2 ring-purple-200' 
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              {/* Badge Popular */}
              {plano.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}

              {/* Header do Plano */}
              <div className={`p-6 rounded-t-2xl bg-gradient-to-r ${plano.cor} text-white`}>
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <IconComponent className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">
                  {plano.nome}
                </h3>
                <p className="text-white/90 text-center text-sm">
                  {plano.descricao}
                </p>
              </div>

              {/* Preço */}
              <div className="p-6 text-center border-b border-gray-100">
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  R$ {plano.preco}
                </div>
                <div className="text-gray-500 text-sm">
                  por mês
                </div>
              </div>

              {/* Serviços Incluídos */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  Inclui:
                </h4>
                <ul className="space-y-3">
                  {plano.servicos.map((servico, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">
                        {servico}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botão de Contratar */}
              <div className="p-6 pt-0">
                <button
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    plano.popular
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Calendar className="w-5 h-5 inline mr-2" />
                  Contratar Plano
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Informações Adicionais */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          🎯 Por que escolher nossos planos?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="flex flex-col items-center">
            <div className="p-3 bg-purple-100 rounded-full mb-3">
              <Scissors className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Economia</h4>
            <p className="text-gray-600 text-sm">
              Pague menos por sessão com nossos planos mensais
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-3 bg-purple-100 rounded-full mb-3">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Flexibilidade</h4>
            <p className="text-gray-600 text-sm">
              Agende quando quiser dentro do seu plano
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-3 bg-purple-100 rounded-full mb-3">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Qualidade</h4>
            <p className="text-gray-600 text-sm">
              Mesmo atendimento de qualidade em todos os planos
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          ❓ Perguntas Frequentes
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Os cortes não utilizados no mês são perdidos?
            </h4>
            <p className="text-gray-600">
              Sim, os cortes são válidos apenas no mês de contratação. Mas você pode agendar quantos quiser dentro do limite do seu plano.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Posso cancelar meu plano a qualquer momento?
            </h4>
            <p className="text-gray-600">
              Sim, você pode cancelar seu plano a qualquer momento. O cancelamento será efetivo no final do período já pago.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Como funciona o agendamento com plano?
            </h4>
            <p className="text-gray-600">
              Você agenda normalmente através do sistema. O sistema automaticamente descontará do seu plano mensal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanosEstabelecimento;
