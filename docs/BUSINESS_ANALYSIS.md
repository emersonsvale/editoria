# EditorIA - Análise de Negócio e Precificação

> Documento de análise de mercado, custos operacionais e estratégia de precificação para o SaaS de geração de imagens com IA.

---

## Índice

1. [Visão Geral do Modelo de Negócio](#1-visão-geral-do-modelo-de-negócio)
2. [Análise de Custos Operacionais](#2-análise-de-custos-operacionais)
3. [Benchmark de Mercado](#3-benchmark-de-mercado)
4. [Estratégia de Precificação](#4-estratégia-de-precificação)
5. [Projeções de Infraestrutura (Supabase)](#5-projeções-de-infraestrutura-supabase)
6. [Análise de Break-Even](#6-análise-de-break-even)
7. [Recomendações Estratégicas](#7-recomendações-estratégicas)

---

## 1. Visão Geral do Modelo de Negócio

### 1.1 Proposta de Valor

O EditorIA é uma plataforma SaaS de geração de imagens com IA que permite aos usuários criar imagens de alta qualidade através de prompts de texto, utilizando a tecnologia Google Gemini (Nano Banana).

### 1.2 Modelo de Monetização

- **Sistema de Créditos**: 1 crédito = 1 imagem gerada
- **API Key Centralizada**: Chave do Gemini fica no servidor (segura)
- **Pacotes de Créditos**: Usuários compram pacotes pré-definidos
- **Controle de Acesso**: Verificação de créditos antes de cada geração

### 1.3 Stack Tecnológico

| Componente | Tecnologia | Função |
|------------|------------|--------|
| Frontend | Nuxt 3 + Vue 3 | Interface do usuário |
| Estilização | Tailwind CSS | Design responsivo |
| State | Pinia | Gerenciamento de estado |
| Backend | Nuxt Server API | Endpoints seguros |
| IA | Google Gemini API | Geração de imagens |
| Database | Supabase | Autenticação, DB, Storage |

---

## 2. Análise de Custos Operacionais

### 2.1 Custos de API - Google Gemini

| Modelo | Custo USD | Custo BRL* | Observação |
|--------|-----------|------------|------------|
| **Gemini 2.5 Flash Image** | $0.039/img | R$ 0,20 | Modelo mais recente |
| **Imagen 3** | $0.030/img | R$ 0,15 | Alternativa mais barata |

> *Cotação base: USD 1 = BRL 5,00

#### Detalhamento do Gemini 2.5 Flash Image:
- Preço: $30.00 por 1 milhão de tokens de saída
- Cada imagem: ~1.290 tokens de saída
- Cálculo: (1.290 / 1.000.000) × $30 = **$0.039/imagem**

### 2.2 Custos de Infraestrutura - Supabase

#### Planos Disponíveis

| Plano | Preço/Mês | Database | Storage | MAUs | Suporte |
|-------|-----------|----------|---------|------|---------|
| **Free** | R$ 0 | 500 MB | 1 GB | 50.000 | Comunidade |
| **Pro** | R$ 125 | 8 GB | 100 GB | 100.000 | Email |
| **Team** | R$ 3.000 | 8 GB+ | 100 GB+ | 100.000+ | Prioritário |
| **Enterprise** | Custom | Custom | Custom | Custom | 24/7 |

#### Custos de Excedente (Plano Pro)

| Recurso | Custo Excedente |
|---------|-----------------|
| Storage | R$ 0,10/GB/mês |
| Database | R$ 0,62/GB/mês |
| MAU adicional | R$ 0,016/usuário |
| Bandwidth | R$ 0,45/GB |

### 2.3 Custo Total por Imagem

```
┌─────────────────────────────────────────────────┐
│ COMPOSIÇÃO DO CUSTO POR IMAGEM                  │
├─────────────────────────────────────────────────┤
│ API Gemini (geração)          R$ 0,20           │
│ Storage Supabase (~1MB/img)   R$ 0,02           │
│ Overhead operacional          R$ 0,03           │
├─────────────────────────────────────────────────┤
│ CUSTO TOTAL                   R$ 0,25/imagem    │
└─────────────────────────────────────────────────┘
```

---

## 3. Benchmark de Mercado

### 3.1 Análise da Concorrência

| Plataforma | Modelo | Faixa de Preço | Custo/Imagem | Tier Gratuito |
|------------|--------|----------------|--------------|---------------|
| **Midjourney** | Assinatura | $10-120/mês | $0.10-0.50 | Não |
| **Leonardo AI** | Freemium | $0-48/mês | $0.01-0.05 | Sim (150 tokens/dia) |
| **DALL-E 3** | Pay-per-use | Variável | $0.04-0.12 | Limitado |
| **Stable Diffusion** | Self-hosted | Infra | ~$0.01 | N/A |
| **Adobe Firefly** | Assinatura | $4.99+/mês | ~$0.05 | Limitado |

### 3.2 Detalhamento por Concorrente

#### Midjourney
- **Basic**: $10/mês - 3.3h GPU/mês (~200 imagens)
- **Standard**: $30/mês - 15h GPU/mês + relaxed ilimitado
- **Pro**: $60/mês - 30h GPU/mês + relaxed ilimitado
- **Mega**: $120/mês - 60h GPU/mês + relaxed ilimitado
- GPU extra: $4/hora

#### Leonardo AI
- **Free**: 150 tokens rápidos/dia (~50 imagens)
- **Apprentice**: $10/mês - 8.500 tokens/mês
- **Artisan**: $24/mês - 25.000 tokens + relaxed ilimitado
- **Maestro**: $48/mês - 60.000 tokens + vídeo

### 3.3 Posicionamento Competitivo

```
                    MAPA DE POSICIONAMENTO
                    
    Alto $│
          │                          ┌─────────┐
          │                          │Midjourney│
          │                          └─────────┘
          │              ┌──────┐
          │              │DALL-E│
          │              └──────┘
          │    ┌────────┐
          │    │Leonardo│     ★ EDITORIA (target)
          │    └────────┘
   Baixo $│
          └────────────────────────────────────────
              Básico                    Avançado
                      FUNCIONALIDADES
```

**Posicionamento EditorIA**: 
- Preço competitivo com Leonardo AI
- Mais acessível que Midjourney
- Foco em simplicidade e mercado brasileiro

---

## 4. Estratégia de Precificação

### 4.1 Pacotes de Créditos (Recomendado)

| Pacote | Créditos | Preço | Custo/Crédito | Margem Bruta | Target |
|--------|----------|-------|---------------|--------------|--------|
| **Starter** | 30 | R$ 14,90 | R$ 0,50 | 50% | Experimentadores |
| **Básico** | 100 | R$ 39,90 | R$ 0,40 | 38% | Usuários casuais |
| **Pro** | 300 | R$ 99,90 | R$ 0,33 | 24% | Criadores |
| **Business** | 1000 | R$ 249,90 | R$ 0,25 | 0% | Agências/Volume |

#### Justificativa da Precificação

```
ANÁLISE DE MARGEM - PACOTE BÁSICO (100 créditos)

Receita:                          R$ 39,90
(-) Custo API (100 × R$ 0,20):    R$ 20,00
(-) Storage (~100MB):             R$ 2,00
(-) Gateway pagamento (~3.5%):    R$ 1,40
(-) Overhead operacional:         R$ 2,00
────────────────────────────────────────────
= Lucro Bruto:                    R$ 14,50
= Margem Bruta:                   36,3%
```

### 4.2 Modelo de Assinatura (Alternativa)

| Plano | Preço/Mês | Créditos/Mês | Bônus | Benefícios |
|-------|-----------|--------------|-------|------------|
| **Hobby** | R$ 29,90 | 100 | - | Acesso básico |
| **Creator** | R$ 69,90 | 250 | +25 | Prioridade na fila |
| **Studio** | R$ 149,90 | 600 | +100 | API access, suporte |
| **Agency** | R$ 299,90 | 1500 | +300 | Multi-usuário, SLA |

#### Vantagens do Modelo de Assinatura
- Receita recorrente previsível (MRR)
- Maior retenção de clientes
- Facilita projeções financeiras
- Reduz churn com compromisso mensal

### 4.3 Estratégia de Conversão

```
FUNIL DE CONVERSÃO PROPOSTO

┌─────────────────────────────────────────────┐
│ VISITANTE                                   │
│ Landing page com exemplos de geração        │
└─────────────────┬───────────────────────────┘
                  ▼
┌─────────────────────────────────────────────┐
│ TRIAL GRATUITO                              │
│ 5-10 créditos grátis no cadastro            │
└─────────────────┬───────────────────────────┘
                  ▼
┌─────────────────────────────────────────────┐
│ PRIMEIRO PACOTE                             │
│ Starter (R$ 14,90) - baixa barreira         │
└─────────────────┬───────────────────────────┘
                  ▼
┌─────────────────────────────────────────────┐
│ UPGRADE                                     │
│ Pacotes maiores com melhor custo/crédito    │
└─────────────────┬───────────────────────────┘
                  ▼
┌─────────────────────────────────────────────┐
│ ASSINATURA                                  │
│ Conversão para plano mensal recorrente      │
└─────────────────────────────────────────────┘
```

---

## 5. Projeções de Infraestrutura (Supabase)

### 5.1 Cenários de Crescimento

| Fase | Usuários | Imagens/Mês | Storage | Plano | Custo Infra |
|------|----------|-------------|---------|-------|-------------|
| **MVP** | 0-100 | ~1.000 | ~1 GB | Free | R$ 0 |
| **Early** | 100-500 | ~5.000 | ~5 GB | Free | R$ 0 |
| **Growth** | 500-2.000 | ~20.000 | ~20 GB | Pro | R$ 125 |
| **Scale** | 2.000-10.000 | ~100.000 | ~100 GB | Pro | R$ 125-200 |
| **Enterprise** | 10.000+ | ~500.000 | ~500 GB | Pro+ | R$ 200-500 |

### 5.2 Projeção de Custos Detalhada

#### Cenário: 1.000 Usuários Ativos

```
PROJEÇÃO MENSAL - 1.000 USUÁRIOS ATIVOS
(Média de 20 imagens/usuário/mês)

RECEITA
────────────────────────────────────────
Pacotes vendidos (mix estimado):
  - 200 × Starter (R$ 14,90)    R$ 2.980
  - 150 × Básico (R$ 39,90)     R$ 5.985
  - 50 × Pro (R$ 99,90)         R$ 4.995
  - 10 × Business (R$ 249,90)   R$ 2.499
────────────────────────────────────────
RECEITA TOTAL                   R$ 16.459

CUSTOS
────────────────────────────────────────
API Gemini (20.000 imgs):       R$ 4.000
Supabase Pro:                   R$ 125
Storage excedente (~20GB):      R$ 0
Gateway pagamento (3.5%):       R$ 576
────────────────────────────────────────
CUSTO TOTAL                     R$ 4.701

RESULTADO
────────────────────────────────────────
LUCRO BRUTO                     R$ 11.758
MARGEM BRUTA                    71,4%
```

### 5.3 Limites do Plano Free (Supabase)

| Recurso | Limite Free | Quando Migrar para Pro |
|---------|-------------|------------------------|
| Database | 500 MB | ~5.000 usuários cadastrados |
| Storage | 1 GB | ~1.000 imagens armazenadas |
| MAUs | 50.000 | Dificilmente será limite |
| Projetos | 2 | Se precisar de staging |

### 5.4 Estratégias de Otimização de Storage

1. **Compressão de Imagens**: Reduzir tamanho médio de 1MB para 200-500KB
2. **CDN Externa**: Usar Cloudflare R2 ($0.015/GB) para imagens antigas
3. **Política de Retenção**: Deletar imagens após 30-90 dias (com aviso)
4. **Download Obrigatório**: Incentivar usuários a baixar suas imagens

---

## 6. Análise de Break-Even

### 6.1 Custos Fixos Mensais

| Item | Fase MVP | Fase Growth | Fase Scale |
|------|----------|-------------|------------|
| Supabase | R$ 0 | R$ 125 | R$ 200 |
| Domínio/SSL | R$ 10 | R$ 10 | R$ 10 |
| Monitoramento | R$ 0 | R$ 50 | R$ 100 |
| Email marketing | R$ 0 | R$ 100 | R$ 200 |
| **Total Fixo** | **R$ 10** | **R$ 285** | **R$ 510** |

### 6.2 Cálculo de Break-Even

```
BREAK-EVEN - FASE GROWTH

Custos Fixos:                    R$ 285/mês
Custo Variável por Crédito:      R$ 0,25
Preço Médio por Crédito:         R$ 0,40
Margem de Contribuição:          R$ 0,15/crédito

Break-Even = Custos Fixos ÷ Margem de Contribuição
Break-Even = R$ 285 ÷ R$ 0,15
Break-Even = 1.900 créditos/mês

≈ 19 pacotes Básicos (100 créditos)
≈ 63 pacotes Starter (30 créditos)
≈ 2 pacotes Business (1000 créditos)
```

### 6.3 Cenários de Lucratividade

| Créditos Vendidos/Mês | Receita | Custos | Lucro | Status |
|-----------------------|---------|--------|-------|--------|
| 500 | R$ 200 | R$ 410 | -R$ 210 | Prejuízo |
| 1.000 | R$ 400 | R$ 535 | -R$ 135 | Prejuízo |
| 2.000 | R$ 800 | R$ 785 | R$ 15 | Break-even |
| 5.000 | R$ 2.000 | R$ 1.535 | R$ 465 | Lucro |
| 10.000 | R$ 4.000 | R$ 2.785 | R$ 1.215 | Lucro |
| 50.000 | R$ 20.000 | R$ 12.785 | R$ 7.215 | Lucro |

---

## 7. Recomendações Estratégicas

### 7.1 Curto Prazo (0-3 meses)

- [ ] **Lançar com plano Free do Supabase** - Custo zero de infraestrutura
- [ ] **Oferecer 10 créditos grátis** - Baixa barreira de entrada
- [ ] **Implementar apenas pacotes de créditos** - Simples de gerenciar
- [ ] **Focar no pacote Starter** - Conversão inicial
- [ ] **Integrar Stripe/Mercado Pago** - Pagamentos brasileiros

### 7.2 Médio Prazo (3-6 meses)

- [ ] **Analisar métricas de uso** - Ajustar precificação se necessário
- [ ] **Implementar modelo de assinatura** - MRR mais previsível
- [ ] **Migrar para Supabase Pro** - Quando atingir limites
- [ ] **Adicionar referral program** - 5 créditos por indicação
- [ ] **Implementar níveis de qualidade** - Standard (1 crédito) vs HD (2 créditos)

### 7.3 Longo Prazo (6-12 meses)

- [ ] **API para desenvolvedores** - Nova linha de receita
- [ ] **Planos Enterprise** - Clientes corporativos
- [ ] **White-label** - Licenciamento da plataforma
- [ ] **Múltiplos modelos de IA** - DALL-E, Stable Diffusion
- [ ] **Marketplace de estilos** - Comunidade gerando receita

### 7.4 Métricas-Chave para Acompanhar

| Métrica | Meta MVP | Meta Growth | Meta Scale |
|---------|----------|-------------|------------|
| CAC (Custo Aquisição) | < R$ 20 | < R$ 30 | < R$ 50 |
| LTV (Lifetime Value) | > R$ 50 | > R$ 100 | > R$ 200 |
| LTV/CAC Ratio | > 2.5x | > 3x | > 4x |
| Churn Mensal | < 15% | < 10% | < 5% |
| Conversão Free→Pago | > 5% | > 8% | > 10% |
| ARPU (Receita/Usuário) | R$ 15 | R$ 25 | R$ 40 |

---

## Anexos

### A. Comparativo: Pacotes Antigos vs. Novos

| Métrica | Pacotes Antigos | Pacotes Novos |
|---------|-----------------|---------------|
| Starter | 50 por R$ 9,90 (R$ 0,20/un) | 30 por R$ 14,90 (R$ 0,50/un) |
| Básico | 150 por R$ 24,90 (R$ 0,17/un) | 100 por R$ 39,90 (R$ 0,40/un) |
| Pro | 500 por R$ 69,90 (R$ 0,14/un) | 300 por R$ 99,90 (R$ 0,33/un) |
| Business | 1000 por R$ 119,90 (R$ 0,12/un) | 1000 por R$ 249,90 (R$ 0,25/un) |
| **Margem Média** | **-20% a 0%** | **24% a 50%** |

> ⚠️ Os pacotes antigos estavam subprecificados, operando com margem negativa ou zero.

### B. Tabela de Custos API (Referência)

| Volume Mensal | Custo Gemini | Custo/Imagem |
|---------------|--------------|--------------|
| 1.000 imgs | R$ 200 | R$ 0,20 |
| 10.000 imgs | R$ 2.000 | R$ 0,20 |
| 100.000 imgs | R$ 20.000 | R$ 0,20 |
| 1.000.000 imgs | R$ 200.000 | R$ 0,20 |

> Google Gemini não oferece desconto por volume. Considerar negociação enterprise para >1M imagens/mês.

### C. Calendário de Revisão

| Data | Ação |
|------|------|
| Mensal | Revisar métricas de uso e conversão |
| Trimestral | Avaliar ajuste de preços |
| Semestral | Benchmarking de concorrentes |
| Anual | Revisão completa do modelo de negócio |

---

## Histórico de Revisões

| Versão | Data | Autor | Alterações |
|--------|------|-------|------------|
| 1.0 | Janeiro/2026 | - | Versão inicial |

---

> **Nota**: Este documento deve ser atualizado conforme mudanças nas APIs, concorrência ou estratégia de negócio. Valores de cotação de moeda e preços de API podem variar.
