# 🌐 Guia de Hospedagem Online - Sistema RPG Amanae

Este guia explica como hospedar o sistema de fichas RPG na internet para que você e seus amigos possam acessar de qualquer lugar.

## 🎯 Por que Hospedar Online?

- ✅ **Acesso de qualquer lugar**: Casa, trabalho, faculdade
- ✅ **Sem configuração de rede**: Não precisa mexer no roteador
- ✅ **Sempre disponível**: 24 horas por dia, 7 dias por semana
- ✅ **Backup automático**: Dados seguros na nuvem
- ✅ **Performance melhor**: Servidores otimizados

---

## 🥇 OPÇÃO 1: RAILWAY (RECOMENDADO)

### ✨ Por que Railway?
- **Mais fácil de usar** - Deploy em minutos
- **PostgreSQL incluído** - Banco de dados automático
- **Plano gratuito** - $5 de crédito por mês
- **URL personalizada** - Fácil de compartilhar

### 📋 Passo a Passo Railway

#### 1. Preparar o Projeto
```bash
# Se ainda não tem, instale o Git
# Windows: https://git-scm.com/download/win
# Mac: brew install git
# Linux: sudo apt install git

# Na pasta do seu projeto:
git init
git add .
git commit -m "Initial commit"
```

#### 2. Subir para GitHub (Opcional mas recomendado)
- Acesse https://github.com
- Crie um novo repositório
- Siga as instruções para fazer push do código

#### 3. Deploy no Railway
- Acesse https://railway.app
- Clique em "Start a New Project"
- Conecte seu GitHub OU faça upload dos arquivos
- Railway detectará automaticamente que é um projeto Node.js

#### 4. Configurar PostgreSQL
- No dashboard do Railway, clique em "Add Service"
- Escolha "PostgreSQL"
- Railway criará automaticamente a variável DATABASE_URL

#### 5. Configurar Variáveis (se necessário)
```
NODE_ENV=production
PORT=5000
```

#### 6. Acessar o App
- Railway fornecerá uma URL como: `https://seu-app.up.railway.app`
- Teste a URL no navegador
- Compartilhe com seus amigos

### 💰 Custos Railway
- **Gratuito**: $5 de crédito por mês (suficiente para uso pessoal)
- **Pago**: $5/mês por serviço após esgotar créditos

---

## 🥈 OPÇÃO 2: RENDER (GRATUITO)

### ✨ Por que Render?
- **Totalmente gratuito** - Para projetos pessoais
- **Fácil configuração** - Interface simples
- **PostgreSQL gratuito** - 1GB de armazenamento

### 📋 Passo a Passo Render

#### 1. Preparar Conta
- Acesse https://render.com
- Crie conta gratuita com GitHub

#### 2. Configurar PostgreSQL
- No dashboard, clique "New +"
- Escolha "PostgreSQL"
- Configure:
  - **Name**: `amanae-rpg-db`
  - **Database**: `amanae_rpg`
  - **User**: `amanae_user`
- Anote a **External Database URL** fornecida

#### 3. Configurar Aplicação
- Clique "New +" → "Web Service"
- Conecte seu repositório GitHub
- Configure:
  - **Build Command**: `npm install`
  - **Start Command**: `npm run dev`
  - **Environment**: Node

#### 4. Adicionar Variáveis de Ambiente
```
DATABASE_URL=sua_url_postgresql_do_passo_2
NODE_ENV=production
```

#### 5. Deploy
- Render fará deploy automaticamente
- URL final: `https://seu-app.onrender.com`

### ⚠️ Limitações Render Gratuito
- App "hiberna" após 15 min sem uso
- Primeiro acesso pode demorar ~30 segundos
- 750 horas/mês (suficiente para uso pessoal)

---

## 🥉 OPÇÃO 3: VERCEL + SUPABASE (AVANÇADO)

### ✨ Quando Usar?
- Quer **performance máxima**
- Precisa de **escalabilidade**
- Tem experiência com desenvolvimento

### 📋 Configuração

#### 1. Backend no Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Na pasta do projeto
vercel

# Seguir instruções no terminal
```

#### 2. Banco no Supabase
- Acesse https://supabase.com
- Crie novo projeto
- Vá em Settings → Database
- Copie a connection string

#### 3. Conectar Backend ao Banco
- No Vercel dashboard, vá em Settings → Environment Variables
- Adicione: `DATABASE_URL=sua_string_supabase`

### 💰 Custos Vercel + Supabase
- **Gratuito**: Até 500GB de transferência/mês
- **Supabase**: 500MB gratuito, depois ~$25/mês

---

## 🔧 PREPARAÇÕES OBRIGATÓRIAS

Antes de fazer deploy em qualquer plataforma:

### 1. Ajustar Configuração do Servidor
Edite `server/index.ts`:
```typescript
const port = parseInt(process.env.PORT ?? "5000", 10);
const host = process.env.HOST ?? "0.0.0.0";

// Certifique-se que tem essa linha:
app.listen(port, host, () => {
  console.log(`Server running on ${host}:${port}`);
});
```

### 2. Adicionar Scripts de Build
Edite `package.json`:
```json
{
  "scripts": {
    "start": "NODE_ENV=production tsx server/index.ts",
    "build": "echo 'Build completed'",
    "dev": "NODE_ENV=development tsx server/index.ts"
  }
}
```

### 3. Testar Localmente Primeiro
```bash
# Simular ambiente de produção
NODE_ENV=production npm run dev
```

---

## 📱 COMO SEUS AMIGOS VÃO USAR

### 1. Compartilhar URL
Exemplo: `https://amanae-rpg-grupo.railway.app`

### 2. Cada Jogador:
- Acessa a URL no navegador (desktop ou celular)
- Clica em "Novo Personagem"
- Preenche nome do personagem
- Edita sua ficha normalmente

### 3. Durante o Jogo:
- Todos acessam suas fichas individuais
- Mudanças são salvas automaticamente
- Mestre pode ver lista de todos os personagens

---

## 🔒 SEGURANÇA E BACKUP

### Backup dos Dados

#### Railway/Render:
```bash
# Instalar cliente PostgreSQL local
# Windows: https://www.postgresql.org/download/
# Mac: brew install postgresql
# Linux: sudo apt install postgresql-client

# Fazer backup
pg_dump "sua_database_url_da_plataforma" > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql "sua_database_url" < backup_20241201.sql
```

### Dicas de Segurança:
- **Nunca compartilhe** credenciais do banco
- **Use senhas fortes** nos serviços
- **Faça backups** antes de sessões importantes
- **Monitore uso** para não exceder limites gratuitos

---

## 🆘 SOLUÇÃO DE PROBLEMAS

### "Application Error" ou "503"
1. Verifique logs na plataforma
2. Confirme se DATABASE_URL está configurada
3. Execute `npm run db:push` se necessário

### "Database Connection Error"
1. Verifique se PostgreSQL está ativo na plataforma
2. Confirme string de conexão
3. Teste conexão localmente

### App Muito Lento
1. **Render gratuito**: Normal no primeiro acesso
2. **Railway**: Verifique se não excedeu créditos
3. **Geral**: Restart do serviço

### Amigos Não Conseguem Acessar
1. Confirme que URL está correta
2. Teste URL em navegador anônimo
3. Verifique se app está "awake" (Render)

---

## 📊 COMPARAÇÃO FINAL

| Critério | Railway | Render | Vercel+Supabase |
|----------|---------|--------|-----------------|
| **Facilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Custo** | $5 grátis/mês | Totalmente gratuito | Gratuito limitado |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Confiabilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **PostgreSQL** | Incluído | Incluído | Separado |

---

## 🎯 RECOMENDAÇÃO FINAL

### Para Iniciantes:
**Use Railway** - É o mais simples e confiável

### Para Orçamento Zero:
**Use Render** - Completamente gratuito

### Para Performance:
**Use Vercel + Supabase** - Máxima velocidade

---

## 📞 PRÓXIMOS PASSOS

1. **Escolha uma plataforma** baseada nas suas necessidades
2. **Siga o guia específico** da plataforma escolhida
3. **Teste com um amigo** antes da sessão oficial
4. **Configure backups** regulares
5. **Divirta-se jogando RPG!** 🎲

**Dica Pro**: Comece com Railway para testar, depois migre para Vercel+Supabase se precisar de mais performance.

---

*Desenvolvido com ❤️ para a comunidade de RPG*