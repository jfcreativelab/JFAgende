// Script para criar o primeiro administrador do sistema
import fetch from 'node-fetch'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function criarPrimeiroAdmin() {
  console.log('\n🔐 CRIAÇÃO DO PRIMEIRO ADMINISTRADOR\n')
  console.log('Este script criará o primeiro admin do sistema JFAgende.\n')

  const nome = await question('Nome do administrador: ')
  const email = await question('Email: ')
  const senha = await question('Senha: ')

  console.log('\n⏳ Criando administrador...\n')

  try {
    const response = await fetch('http://localhost:5000/api/admin/auth/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome,
        email,
        senha
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Erro:', data.error)
      process.exit(1)
    }

    console.log('✅ Administrador criado com sucesso!\n')
    console.log('📋 Dados do admin:')
    console.log(`   Nome: ${data.admin.nome}`)
    console.log(`   Email: ${data.admin.email}`)
    console.log(`   Role: ${data.admin.role}\n`)
    console.log('🔗 Acesse: http://localhost:3000/admin/login\n')
    
  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error.message)
    console.error('\n⚠️  Certifique-se de que o servidor backend está rodando em http://localhost:5000\n')
    process.exit(1)
  }

  rl.close()
}

criarPrimeiroAdmin()





















