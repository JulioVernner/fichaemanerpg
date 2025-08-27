# Sistema de Fichas - Amanae: Filhos de Kaos RPG

Um sistema completo de fichas de personagem para grupos de RPG do sistema Amanae - Filhos de Kaos, desenvolvido com React, Node.js e PostgreSQL.

## 🎯 Características Principais

- ✅ **Sistema Multi-jogador**: Cada jogador pode ter sua própria ficha
- ✅ **Banco de Dados**: Dados salvos permanentemente (PostgreSQL)
- ✅ **Ficha Completa**: Baseada no PDF original (versão 8.0)
- ✅ **Auto-salvamento**: Mudanças são salvas automaticamente
- ✅ **Interface Responsiva**: Funciona em desktop, tablet e celular
- ✅ **Gestão de Personagens**: Criar, editar, excluir e listar personagens
- ✅ **Campo Narrativo**: Histórico detalhado de cada personagem
- ✅ **Acesso Compartilhado**: Todos os jogadores acessam o mesmo sistema

## 🚀 Guia Completo de Instalação e Uso com Amigos

### 1. Baixar e Preparar os Arquivos

#### Opção A: Download direto do Replit
1. No Replit, navegue até os arquivos do projeto
2. Clique com o botão direito na pasta raiz
3. Selecione "Download" para baixar como arquivo ZIP
4. Extraia o arquivo ZIP em uma pasta no seu computador

#### Opção B: Git clone (se conectado ao GitHub)
```bash
git clone [URL_DO_REPOSITORIO]
cd [NOME_DA_PASTA]
```

### 2. Instalar Dependências do Sistema

#### Instalar Node.js
- Baixe e instale o Node.js versão 18 ou superior: https://nodejs.org
- Verifique a instalação:
```bash
node --version
npm --version
```

#### Instalar PostgreSQL (Recomendado para uso com amigos)
- **Windows**: Baixe de https://www.postgresql.org/download/windows/
- **Mac**: Use Homebrew: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

### 3. Configuração do Banco de Dados

#### Opção A: PostgreSQL Local (Recomendado para grupos)
1. Crie um banco de dados:
```sql
CREATE DATABASE amanae_rpg;
CREATE USER amanae_user WITH PASSWORD 'senha_segura';
GRANT ALL PRIVILEGES ON DATABASE amanae_rpg TO amanae_user;
```

2. Crie um arquivo `.env` na raiz do projeto:
```bash
DATABASE_URL=postgresql://amanae_user:senha_segura@localhost:5432/amanae_rpg
```

#### Opção B: Usar em Memória (Apenas para testes)
Se não quiser instalar PostgreSQL, edite `server/storage.ts`:
```typescript
// Comente esta linha:
// export const storage = new DatabaseStorage();

// E descomente esta:
export const storage = new MemStorage();
```

### 4. Instalar e Configurar o Projeto

```bash
# Instalar todas as dependências
npm install

# Configurar o banco de dados (se usando PostgreSQL)
npm run db:push

# Iniciar o servidor
npm run dev
```

### 5. Acesso para o Grupo de Amigos

#### Configuração de Rede Local

1. **Descobrir seu IP local**:
   - Windows: Abra cmd e digite `ipconfig`
   - Mac/Linux: Digite `ifconfig` ou `ip addr show`
   - Procure por algo como `192.168.1.XXX`

2. **Configurar o servidor para aceitar conexões externas**:
   Edite `server/index.ts` e mude de:
   ```typescript
   const port = parseInt(process.env.PORT ?? "5000", 10);
   const host = process.env.HOST ?? "localhost";
   ```
   Para:
   ```typescript
   const port = parseInt(process.env.PORT ?? "5000", 10);
   const host = process.env.HOST ?? "0.0.0.0";
   ```

3. **Compartilhar o acesso**:
   - Seus amigos podem acessar via: `http://SEU_IP:5000`
   - Exemplo: `http://192.168.1.100:5000`
   - **Importante**: Todos devem estar na mesma rede Wi-Fi

#### Configuração de Firewall
- **Windows**: Permita o Node.js no firewall quando solicitado
- **Mac**: Vá em Preferências > Segurança > Firewall > Opções > Permitir apps assinados
- **Linux**: `sudo ufw allow 5000`

## Estrutura do Projeto

```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/ui/  # Componentes de interface
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── lib/            # Utilitários e configurações
│   │   └── hooks/          # React hooks customizados
│   └── index.html
├── server/                 # Backend Express
│   ├── index.ts           # Servidor principal
│   ├── routes.ts          # Rotas da API
│   └── storage.ts         # Sistema de armazenamento
├── shared/                # Tipos e esquemas compartilhados
│   └── schema.ts          # Definições de dados do personagem
└── package.json           # Dependências e scripts
```

## 🎮 Como Usar com Seu Grupo de RPG

### Fluxo de Uso Típico

1. **Mestre configura o sistema**:
   - Instala e roda o projeto no seu computador
   - Compartilha o IP local com os jogadores
   - Todos acessam via navegador

2. **Cada jogador cria sua ficha**:
   - Acessa `http://IP_DO_MESTRE:5000`
   - Clica em "Novo Personagem"
   - Preenche o nome e começa a editar

3. **Durante o jogo**:
   - Cada um edita sua própria ficha
   - Mudanças são salvas automaticamente
   - Mestre pode ver todas as fichas na lista

### Gerenciamento de Personagens

#### Criar Novo Personagem
1. Na tela inicial, clique em "Novo Personagem"
2. Digite o nome do personagem
3. Clique em "Criar"
4. Comece a preencher os dados

#### Editar Personagem
1. Na lista de personagens, clique no card do personagem
2. Edite qualquer campo necessário
3. As mudanças são salvas automaticamente após 1 segundo

#### Excluir Personagem
1. Na ficha do personagem, clique no ícone da lixeira no topo
2. Confirme a exclusão
3. O personagem será removido permanentemente

### Dicas para Mestres

- **Backup**: Exporte o banco de dados regularmente
- **Organização**: Use nomes descritivos para os personagens
- **Acesso**: Mantenha o computador ligado durante as sessões
- **Rede**: Certifique-se que todos estão na mesma Wi-Fi

## 📋 Funcionalidades Completas da Ficha

### 👤 Informações Básicas
- Nome, idade, altura, peso
- Experiência e nível
- Raça, classe, vocação, pacto

### ⚡ Atributos Principais
- Vida, Mana, Mácula, Energia (atual/máximo)
- Sorte, Sanidade
- Testes de morte e ressurreição (checkboxes)
- Deslocamento e iniciativa (base + bônus)
- Bênção

### 🏃 Perícias Físicas
- Força, Pontaria, Combate
- Esquiva, Defesa, Atletismo
- Montaria, Furtividade, Reflexo
- Furto, Arrombamento

### 🧠 Perícias Mentais
- Força de vontade, Socialização
- Científico, Linguístico, Medicinal
- Emanação, Controle mágico
- Metalurgia, Escrita
- Sensibilidade mágica, Percepção

### ⚔️ Equipamentos
- Arma principal/secundária (nome, dano, duração)
- Armadura (nome, proteção, duração)
- Efeitos negativos (nome, descrição, duração)

### 🌟 Características do Personagem
- Vantagens e desvantagens
- Testes e habilidades de classe
- Habilidades especiais
- Magias conhecidas

### 🎒 Inventário e Narrativa
- Mochila (itens diversos)
- Ouro e outros recursos
- Relações com NPCs
- **Histórico narrativo do personagem** (novo campo expandido)

## Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Validação**: Zod
- **Estado**: React Hook Form, TanStack Query
- **Build**: Vite

## 🛠️ Comandos e Scripts

```bash
# Desenvolvimento
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Compilar para produção
npm run preview      # Visualizar build de produção

# Banco de Dados
npm run db:push      # Aplicar mudanças no esquema do banco
npm run db:pull      # Sincronizar esquema do banco
```

## 🔧 Solução de Problemas Comuns

### Erro "Port 5000 already in use"
```bash
# Pare outros processos na porta 5000
sudo lsof -ti:5000 | xargs kill -9
# Ou use uma porta diferente editando o arquivo .env:
PORT=3000
```

### Amigos não conseguem acessar
1. Verifique se estão na mesma rede Wi-Fi
2. Confirme que o firewall permite conexões na porta 5000
3. Teste o IP com: `ping SEU_IP`
4. Certifique-se que editou o host para `0.0.0.0`

### Dados não salvam
1. Verifique se o PostgreSQL está rodando
2. Confirme a string de conexão no `.env`
3. Execute `npm run db:push` novamente

### Performance lenta
1. Feche abas desnecessárias do navegador
2. Reinicie o servidor com `Ctrl+C` e `npm run dev`
3. Verifique a conexão de internet

## 🌐 Alternativas de Hospedagem

### Para Acesso Remoto (Internet)
Se quiser que amigos acessem de qualquer lugar:

1. **Heroku** (gratuito com limitações)
2. **Railway** (fácil de usar)
3. **DigitalOcean** (mais controle)
4. **Vercel** (para frontend) + **Supabase** (para banco)

### Para Uso Local Avançado
- **Docker**: Containerizar a aplicação
- **Ngrok**: Túnel para acesso externo temporário
- **VPN**: Criar rede privada virtual

## 📱 Uso em Dispositivos Móveis

### Android/iPhone
1. Abra qualquer navegador (Chrome, Safari, Firefox)
2. Acesse `http://IP_DO_MESTRE:5000`
3. Adicione à tela inicial para acesso rápido:
   - **Android**: Menu > "Adicionar à tela inicial"
   - **iPhone**: Compartilhar > "Adicionar à Tela de Início"

### Recursos Mobile
- Interface totalmente responsiva
- Campos otimizados para toque
- Auto-zoom em campos de entrada
- Navegação por gestos

## 🔒 Segurança e Backup

### Backup dos Dados
```bash
# Backup do banco PostgreSQL
pg_dump amanae_rpg > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql amanae_rpg < backup_20240123.sql
```

### Dicas de Segurança
- Use senhas fortes no banco de dados
- Mantenha o Node.js atualizado
- Considere VPN para acesso externo
- Faça backups regulares antes das sessões

## 📋 Checklist para Sessão de RPG

### Antes da Sessão
- [ ] Servidor rodando: `npm run dev`
- [ ] Banco de dados funcionando
- [ ] IP compartilhado com jogadores
- [ ] Backup dos dados feito
- [ ] Firewall configurado

### Durante a Sessão
- [ ] Todos conseguem acessar
- [ ] Fichas carregando corretamente
- [ ] Auto-salvamento funcionando
- [ ] Computador conectado à energia

### Após a Sessão
- [ ] Backup final dos dados
- [ ] Verificar integridade das fichas
- [ ] Anotar problemas para correção

## 📞 Suporte e Contribuição

### Problemas e Dúvidas
- Verifique a seção de solução de problemas
- Teste com um navegador diferente
- Reinicie o servidor e tente novamente

### Customização
O código está bem documentado e pode ser modificado:
- Campos da ficha: `shared/schema.ts`
- Interface: `client/src/pages/`
- Servidor: `server/`

## ⚖️ Licença e Créditos

Este projeto é uma implementação independente baseada na ficha oficial do **Amanae - Filhos de Kaos RPG**. 

- ✅ Código fonte: Livre para uso pessoal e em grupos de RPG
- ✅ Sistema RPG: Todos os direitos pertencem aos criadores originais
- ✅ Uso comercial: Não autorizado sem permissão dos criadores do sistema

**Desenvolvido com ❤️ para a comunidade de RPG**