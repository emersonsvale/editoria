# EditorIA - Gerador de Imagens com IA (SaaS)

Uma aplicação SaaS de geração de imagens com IA usando o **Nano Banana** (Gemini Image Generation), construída com Nuxt 3, Vue 3 e Tailwind CSS.

## Modelo de Negócio

O EditorIA funciona como um SaaS onde você vende créditos para os usuários gerarem imagens:

- **1 crédito = 1 imagem gerada**
- A API Key do Gemini fica no servidor (segura)
- Usuários compram pacotes de créditos
- Você controla e monetiza o acesso

## Funcionalidades

### Geração de Imagens (`/editor`)
- Interface de chat intuitiva para criar imagens com IA
- Suporte a múltiplos tamanhos de imagem (1:1, 16:9, 9:16, etc.)
- Edição de imagens existentes com prompts
- Histórico de conversas salvo localmente
- Galeria de imagens geradas
- Download de imagens
- Geração de variações

### Sistema de Créditos
- Exibição de créditos disponíveis no header
- Modal de compra de créditos (pronto para integrar pagamento)
- Verificação de créditos antes de gerar
- Dedução automática após geração

## Tecnologias

- **Nuxt 3** - Framework Vue.js full-stack
- **Vue 3** - Framework JavaScript reativo (Composition API)
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utility-first
- **Pinia** - State management
- **Google Gemini API** - Geração de imagens (Nano Banana)

## Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Configuração

### Variáveis de Ambiente

```env
# API Key do Google AI (PRIVADA - apenas no servidor)
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Custo em créditos por imagem
CREDITS_PER_IMAGE=1
```

> **IMPORTANTE**: A `GEMINI_API_KEY` fica no servidor e nunca é exposta ao cliente.

## Arquitetura

```
editoria/
├── server/
│   └── api/
│       ├── generate.post.ts    # Endpoint de geração (chama Gemini)
│       └── credits.get.ts      # Endpoint de créditos
├── components/
│   └── chat/
│       ├── ChatMessage.vue
│       ├── ConversationSidebar.vue
│       ├── CreditsModal.vue    # Modal de compra de créditos
│       ├── ImageModal.vue
│       ├── PromptInput.vue
│       └── SettingsModal.vue
├── composables/
│   └── useNanobanana.ts        # Client-side (chama /api/generate)
├── stores/
│   └── chat.ts                 # Estado do chat e créditos
└── pages/
    └── editor.vue              # Interface principal
```

## API Endpoints

### POST /api/generate
Gera imagens usando o Gemini.

**Request:**
```json
{
  "prompt": "Um gato astronauta no espaço",
  "aspectRatio": "1:1",
  "inputImages": ["data:image/png;base64,..."] // opcional, para edição
}
```

**Response:**
```json
{
  "success": true,
  "images": [
    { "url": "data:image/png;base64,...", "mimeType": "image/png" }
  ],
  "creditsUsed": 1
}
```

### GET /api/credits
Retorna os créditos do usuário.

**Response:**
```json
{
  "credits": 100,
  "used": 15,
  "total": 115
}
```

## Integrações Pendentes

### 1. Autenticação de Usuários
O código tem TODOs marcados para implementar:
- Sessão de usuário
- Verificação de autenticação nos endpoints

### 2. Sistema de Pagamento
O modal de créditos está pronto para integrar:
- Stripe
- Mercado Pago
- Outro gateway

### 3. Banco de Dados
Implementar persistência de:
- Créditos por usuário
- Histórico de transações
- Imagens geradas (opcional)

## Pacotes de Créditos Sugeridos

| Pacote | Créditos | Preço | Bônus |
|--------|----------|-------|-------|
| Básico | 50 | R$ 9,90 | - |
| Popular | 150 | R$ 24,90 | +10 |
| Pro | 500 | R$ 69,90 | +50 |
| Business | 1000 | R$ 119,90 | +150 |

## Tamanhos de Imagem

| Proporção | Descrição |
|-----------|-----------|
| `1:1` | Quadrado |
| `16:9` | Paisagem (widescreen) |
| `9:16` | Retrato (mobile/stories) |
| `4:3` | Paisagem tradicional |
| `3:4` | Retrato |
| `3:2` | Foto paisagem |
| `2:3` | Foto retrato |
| `21:9` | Ultra-wide |

## Segurança

- A API Key do Gemini **nunca** é exposta ao cliente
- Todas as requisições passam pelo servidor Nuxt
- Validação de créditos antes de processar
- Rate limiting pode ser implementado no servidor

## Licença

Este projeto é privado e desenvolvido para fins comerciais.
