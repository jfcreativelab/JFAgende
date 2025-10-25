import React, { useState, useEffect } from 'react';
import { Crown, Star, Zap, Gem, Plus, Edit, Trash2, Save, X, DollarSign, Clock, Scissors } from 'lucide-react';
import Button from './Button';
import Card from './Card';
import Toast from './Toast';
import planoEstabelecimentoService from '../services/planoEstabelecimentoService';

const GerenciarPlanosBarbearia = ({ estabelecimentoId }) => {
  const [planos, setPlanos] = useState([]);
  const [editandoPlano, setEditandoPlano] = useState(null);
  const [novoPlano, setNovoPlano] = useState({
    nome: '',
    descricao: '',
    preco: 0,
    servicos: [],
    ativo: true
  });
  const [toast, setToast] = useState(null);
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
      ativo: true
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
      ativo: true
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
      ativo: true
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
      ativo: true
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

  const handleEditarPlano = (plano) => {
    setEditandoPlano({ ...plano });
  };

  const handleSalvarPlano = async () => {
    if (!editandoPlano.nome || !editandoPlano.descricao || editandoPlano.preco <= 0) {
      setToast({
        type: 'error',
        message: 'Preencha todos os campos obrigatórios'
      });
      return;
    }

    try {
      const planoAtualizado = await planoEstabelecimentoService.updatePlano(editandoPlano.id, editandoPlano);
      setPlanos(planos.map(p => 
        p.id === editandoPlano.id ? planoAtualizado : p
      ));
      setEditandoPlano(null);
      setToast({
        type: 'success',
        message: 'Plano atualizado com sucesso!'
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Erro ao atualizar plano: ' + (error.response?.data?.error || error.message)
      });
    }
  };

  const handleCancelarEdicao = () => {
    setEditandoPlano(null);
  };

  const handleToggleAtivo = async (planoId) => {
    try {
      const plano = planos.find(p => p.id === planoId);
      const planoAtualizado = await planoEstabelecimentoService.updatePlano(planoId, { 
        ativo: !plano.ativo 
      });
      
      setPlanos(planos.map(p => 
        p.id === planoId ? planoAtualizado : p
      ));
      setToast({
        type: 'success',
        message: 'Status do plano atualizado!'
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Erro ao atualizar status: ' + (error.response?.data?.error || error.message)
      });
    }
  };

  const handleAdicionarServico = async (planoId) => {
    const novoServico = prompt('Digite o novo serviço:');
    if (novoServico) {
      try {
        const plano = planos.find(p => p.id === planoId);
        const novosServicos = [...plano.servicos, novoServico];
        
        const planoAtualizado = await planoEstabelecimentoService.updatePlano(planoId, { 
          servicos: novosServicos 
        });
        
        setPlanos(planos.map(p => 
          p.id === planoId ? planoAtualizado : p
        ));
      } catch (error) {
        setToast({
          type: 'error',
          message: 'Erro ao adicionar serviço: ' + (error.response?.data?.error || error.message)
        });
      }
    }
  };

  const handleRemoverServico = async (planoId, servicoIndex) => {
    try {
      const plano = planos.find(p => p.id === planoId);
      const novosServicos = plano.servicos.filter((_, index) => index !== servicoIndex);
      
      const planoAtualizado = await planoEstabelecimentoService.updatePlano(planoId, { 
        servicos: novosServicos 
      });
      
      setPlanos(planos.map(p => 
        p.id === planoId ? planoAtualizado : p
      ));
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Erro ao remover serviço: ' + (error.response?.data?.error || error.message)
      });
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            💈 Gerenciar Planos Mensais
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure os planos que seus clientes podem contratar
          </p>
        </div>
        <Button
          onClick={() => setToast({ type: 'info', message: 'Funcionalidade em desenvolvimento' })}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      {/* Lista de Planos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {planos.map((plano) => {
          const IconComponent = plano.icone;
          const isEditando = editandoPlano?.id === plano.id;
          
          return (
            <Card key={plano.id} className="overflow-hidden">
              <div className={`p-6 bg-gradient-to-r ${plano.cor} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-white/20 rounded-full mr-3">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{plano.nome}</h3>
                      <p className="text-white/90 text-sm">
                        {isEditando ? 'Editando...' : plano.descricao}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleAtivo(plano.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        plano.ativo 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {plano.ativo ? 'Ativo' : 'Inativo'}
                    </button>
                    <button
                      onClick={() => handleEditarPlano(plano)}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {isEditando ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nome do Plano
                      </label>
                      <input
                        type="text"
                        value={editandoPlano.nome}
                        onChange={(e) => setEditandoPlano({...editandoPlano, nome: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Descrição
                      </label>
                      <textarea
                        value={editandoPlano.descricao}
                        onChange={(e) => setEditandoPlano({...editandoPlano, descricao: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows="2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Preço Mensal (R$)
                      </label>
                      <input
                        type="number"
                        value={editandoPlano.preco}
                        onChange={(e) => setEditandoPlano({...editandoPlano, preco: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Serviços Incluídos
                      </label>
                      <div className="space-y-2">
                        {editandoPlano.servicos.map((servico, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={servico}
                              onChange={(e) => {
                                const novosServicos = [...editandoPlano.servicos];
                                novosServicos[index] = e.target.value;
                                setEditandoPlano({...editandoPlano, servicos: novosServicos});
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <button
                              onClick={() => handleRemoverServico(plano.id, index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAdicionarServico(plano.id)}
                          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Adicionar Serviço
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleSalvarPlano}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar
                      </Button>
                      <Button
                        onClick={handleCancelarEdicao}
                        variant="outline"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        R$ {plano.preco}
                      </div>
                      <div className="text-sm text-gray-500">
                        por mês
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <Scissors className="w-4 h-4 mr-2 text-purple-600" />
                        Serviços Incluídos:
                      </h4>
                      <ul className="space-y-1">
                        {plano.servicos.map((servico, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-purple-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                              {servico}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-500">
                        {plano.ativo ? 'Plano ativo' : 'Plano inativo'}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditarPlano(plano)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Estatísticas */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📊 Estatísticas dos Planos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {planos.filter(p => p.ativo).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Planos Ativos
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              R$ {planos.reduce((acc, p) => acc + p.preco, 0).toFixed(0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Receita Total/Mês
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {planos.reduce((acc, p) => acc + p.servicos.length, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Serviços Oferecidos
            </div>
          </div>
        </div>
      </Card>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default GerenciarPlanosBarbearia;
