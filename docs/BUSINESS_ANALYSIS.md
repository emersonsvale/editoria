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
8. [Análise do Plano e Sugestões de Melhoria](#8-análise-do-plano-e-sugestões-de-melhoria)

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
| **Gemini 3 Pro Image** *(em uso)* | $0.134/img | R$ 0,67 | Modelo atual do EditorIA (1K/2K) |
| **Gemini 2.5 Flash Image** | $0.039/img | R$ 0,20 | Alternativa mais barata |
| **Imagen 3** | $0.030/img | R$ 0,15 | Alternativa dedicada imagem |

> *Cotação base: USD 1 = BRL 5,00

#### Modelo em uso: Gemini 3 Pro Image Preview
- Configuração: `NUXT_GEMINI_IMAGE_MODEL=gemini-3-pro-image-preview`
- Preço oficial: $120 por 1 milhão de tokens de saída (imagens)
- Imagem 1K/2K: 1.120 tokens → **$0.134/imagem** (R$ 0,67)
- Imagem 4K: 2.000 tokens → $0.24/imagem (R$ 1,20)
- Fonte: [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)

#### Alternativa mais barata: Gemini 2.5 Flash Image
- Preço: $30 por 1 milhão de tokens de saída
- Cada imagem: ~1.290 tokens → **$0.039/imagem** (R$ 0,20)

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

**Com Gemini 3 Pro Image (modelo atual):**

```
┌─────────────────────────────────────────────────┐
│ COMPOSIÇÃO DO CUSTO POR IMAGEM (PRO)            │
├─────────────────────────────────────────────────┤
│ API Gemini 3 Pro (geração)     R$ 0,67           │
│ Storage Supabase (~1MB/img)    R$ 0,02           │
│ Overhead operacional           R$ 0,03           │
├─────────────────────────────────────────────────┤
│ CUSTO TOTAL                    R$ 0,72/imagem   │
└─────────────────────────────────────────────────┘
```

**Se usar Gemini 2.5 Flash Image (alternativa):**

```
┌─────────────────────────────────────────────────┐
│ COMPOSIÇÃO DO CUSTO POR IMAGEM (FLASH)           │
├─────────────────────────────────────────────────┤
│ API Gemini (geração)           R$ 0,20           │
│ Storage Supabase (~1MB/img)    R$ 0,02           │
│ Overhead operacional           R$ 0,03           │
├─────────────────────────────────────────────────┤
│ CUSTO TOTAL                    R$ 0,25/imagem   │
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

### 4.1 Pacotes de Créditos (Recomendado – Gemini 3 Pro em uso)

**Modelo em uso:** **Gemini 3 Pro Image** (custo R$ 0,72/cred). **Preços comerciais:** R$ 39,90 | R$ 99,90 | R$ 297,90. Starter mais caro por crédito (entrada); Pro com melhor custo-benefício (mais popular).

| Pacote | Créditos | Preço | Preço/Crédito | Margem Bruta (Pro) | Target |
|--------|----------|-------|---------------|---------------------|--------|
| **Starter** | 30 | R$ 39,90 | R$ 1,33 | ~46% | Experimentadores (entrada) |
| **Pro** | 100 | R$ 99,90 | R$ 1,00 | ~28% | Criadores (melhor custo-benefício) |
| **Agency** | 300 | R$ 297,90 | R$ 0,99 | ~27% | Agências/Volume |

#### Justificativa (preços comerciais – Gemini 3 Pro)

```
ANÁLISE DE MARGEM - PACOTE PRO (100 créditos, R$ 99,90)
Custo API: R$ 0,72/imagem (Gemini 3 Pro)

Receita:                          R$ 99,90
(-) Custo API (100 × R$ 0,72):    R$ 72,00
(-) Storage (~100MB):              R$ 2,00
(-) Gateway pagamento (~3.5%):     R$ 3,50
(-) Overhead operacional:          R$ 2,00
────────────────────────────────────────────
= Lucro Bruto:                     R$ 20,40
= Margem Bruta:                    ~28% (preço/crédito)
```

Preços comerciais: **R$ 39,90 | R$ 99,90 | R$ 297,90**. Starter com preço/cred maior (pacote entrada); Pro com melhor valor por crédito — incentiva upgrade.

#### 4.1.1 Alternativa: Gemini 2.5 Flash (custos menores)

Se no futuro trocar para **Gemini 2.5 Flash** (R$ 0,25/cred), pode-se reduzir preços (ex.: R$ 14,90 / R$ 39,90) e ampliar margem ou competitividade.

### 4.2 Modelo de Assinatura (Alternativa)

> **Nota:** Os preços abaixo são referência para cenário com **Gemini 2.5 Flash** (custo menor). Com **Gemini 3 Pro** em uso, seria necessário reajustar preços ou créditos/mês para manter margem positiva.

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
│ Starter (R$ 39,90) - entrada                │
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

RECEITA (Gemini 3 Pro – preços comerciais)
────────────────────────────────────────
Pacotes vendidos (mix estimado):
  - 200 × Starter (R$ 39,90)     R$ 7.980
  - 150 × Pro (R$ 99,90)         R$ 14.985
  - 50 × Agency (R$ 297,90)       R$ 14.895
────────────────────────────────────────
RECEITA TOTAL                    R$ 37.860

CUSTOS (Gemini 3 Pro – R$ 0,72/img)
────────────────────────────────────────
API Gemini (20.000 imgs):       R$ 14.400
Supabase Pro:                   R$ 125
Storage excedente (~20GB):      R$ 0
Gateway pagamento (3.5%):       R$ 1.325
────────────────────────────────────────
CUSTO TOTAL                     R$ 15.850

RESULTADO
────────────────────────────────────────
LUCRO BRUTO                     R$ 22.010
MARGEM BRUTA                    ~58%
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

**Com Gemini 3 Pro e preços competitivos (margem ~18–28%):**

```
BREAK-EVEN - FASE GROWTH (Gemini 3 Pro)

Custos Fixos:                    R$ 285/mês
Custo Variável por Crédito:      R$ 0,72
Preço Médio por Crédito:         ~R$ 0,92
Margem de Contribuição:          ~R$ 0,20/crédito

Break-Even = R$ 285 ÷ R$ 0,20 ≈ 1.425 créditos/mês
≈ 15 pacotes Pro | ≈ 48 Starter | ≈ 2 Agency
```

### 6.3 Cenários de Lucratividade

*Cenário com **Gemini 3 Pro** (R$ 0,72/cred) e **preços competitivos** (preço médio ~R$ 0,92/cred, margem ~R$ 0,20/cred).*

| Créditos Vendidos/Mês | Receita (est.) | Custos | Lucro (est.) | Status |
|-----------------------|----------------|--------|--------------|--------|
| 500 | R$ 460 | R$ 645 | -R$ 185 | Prejuízo |
| 1.000 | R$ 920 | R$ 1.005 | -R$ 85 | Prejuízo |
| 1.500 | R$ 1.380 | R$ 1.365 | R$ 15 | Break-even |
| 5.000 | R$ 4.600 | R$ 3.885 | R$ 715 | Lucro |
| 10.000 | R$ 9.200 | R$ 7.485 | R$ 1.715 | Lucro |
| 50.000 | R$ 46.000 | R$ 36.285 | R$ 9.715 | Lucro |

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
| Taxa de recompra (% que compram 2+ pacotes) | > 20% | > 30% | > 40% |
| ARPU (Receita/Usuário) | R$ 15 | R$ 25 | R$ 40 |

---

## 8. Análise do Plano e Sugestões de Melhoria

### 8.1 Pontos Fortes do Plano Atual

- **Custos bem mapeados**: API (Gemini 3 Pro), Supabase, gateway e overhead estão explícitos; margem por pacote é clara (~27–28%).
- **Preços comerciais alinhados**: R$ 39,90 | R$ 99,90 | R$ 297,90; Starter como entrada, Pro com melhor custo-benefício.
- **Break-even e cenários**: Break-even (~1.425 créditos/mês) e tabela de lucratividade dão referência para decisão.
- **Funil de conversão**: Trial → Starter → upgrade → assinatura está descrito; recomendações por fase (curto/médio/longo) orientam execução.
- **Métricas definidas**: CAC, LTV, LTV/CAC, churn, conversão e ARPU permitem acompanhar saúde do negócio.

### 8.2 Melhorias Sugeridas

#### Precificação e custos

1. **Trial gratuito (10 créditos)**  
   Custo por cadastro: 10 × R$ 0,72 ≈ **R$ 7,20**. Somar ao CAC (ex.: CAC R$ 20 + trial R$ 7,20 = custo total de aquisição ~R$ 27). Garantir que LTV > esse valor; se CAC subir, revisar quantidade de créditos grátis ou condicionar a verificação (ex.: e-mail confirmado).

2. **Gateway de pagamento no Brasil**  
   Taxas reais (Mercado Pago, Stripe Brasil) costumam ser ~3,99% + R$ 0,40 por transação. Usar 3,5% como referência é ok; em projeções conservadoras, considerar **4%** para margem de segurança.

3. **Cotação USD/BRL**  
   Plano usa R$ 5,00. Incluir no Calendário de Revisão (Anexo C) um item **trimestral**: “Revisar cotação USD/BRL e impacto no custo API”.

#### Projeções e métricas

4. **Clareza na projeção “1.000 usuários”**  
   Hoje: 200 Starter + 150 Pro + 50 Agency = **400 pagantes** e 20.000 imagens/mês. Esclarecer no texto se “1.000 usuários ativos” = 1.000 cadastrados (então conversão paga = 40%) ou 1.000 pagantes. Se for cadastrados, 40% de conversão é otimista; considerar cenário com 5–10% free→pago (50–100 pagantes) para sensibilidade.

5. **Métrica de recompra**  
   Como o modelo é por pacotes (não assinatura), incluir **“Taxa de recompra”** ou **“% usuários que compram 2+ pacotes”** nas métricas (7.4). Objetivo: entender retenção e LTV real.

#### Modelo de assinatura (seção 4.2)

6. **Tabela de assinatura vs. custo Pro**  
   Planos Hobby (R$ 29,90 / 100 créditos) e Creator (R$ 69,90 / 250 créditos) ficam **abaixo do custo** com Gemini 3 Pro (R$ 0,72/cred). Sugestão: na seção 4.2, acrescentar nota: *“Preços da tabela de assinatura são referência para cenário com Gemini 2.5 Flash ou precisam ser reajustados se usar Pro.”* Ou recalcular preços mínimos com Pro (ex.: Hobby com menos créditos ou preço maior).

#### Risco e diferenciação

7. **Risco de aumento de preço da API**  
   Se o Google subir o preço do Gemini 3 Pro, a margem cai. Mitigações: (a) manter no documento a regra de **revisão trimestral de preços** (já existe no Anexo C); (b) avaliar **Batch API** do Gemini (desconto ~50%) para filas não em tempo real, se surgir uso compatível.

8. **Diferenciação explícita**  
   Além de “preço e simplicidade”, deixar claro no plano: **qualidade do modelo Pro** vs. concorrência, **idioma e UX em português**, **créditos avulsos sem assinatura** e **créditos que não expiram**. Isso ajuda em copy de landing e vendas.

### 8.3 Conclusão

O plano está **sólido e utilizável**: custos, preços e break-even estão coerentes com o uso do Gemini 3 Pro. As melhorias acima são **incrementais** (trial no CAC, gateway 4%, clarificar projeção, métrica de recompra, alinhar assinatura ao Pro, cotação USD, risco de API e diferenciação). Implementando-as, o documento fica mais realista e fácil de operar no dia a dia.

---

## Anexos

### A. Comparativo: Pacotes Antigos vs. Atuais (Gemini 3 Pro)

| Métrica | Pacotes Antigos (subprecificados) | Pacotes Atuais (comerciais, Pro) |
|---------|-----------------------------------|----------------------------------|
| Starter | 50 por R$ 9,90 (R$ 0,20/un) | 30 por R$ 39,90 (R$ 1,33/un) |
| Pro | 500 por R$ 69,90 (R$ 0,14/un) | 100 por R$ 99,90 (R$ 1,00/un) |
| Agency | 1000 por R$ 119,90 (R$ 0,12/un) | 300 por R$ 297,90 (R$ 0,99/un) |
| **Margem (Gemini 3 Pro)** | **Negativa** | **~20% a 28%** |

> Preços atuais consideram **Gemini 3 Pro** em uso: competitivos e com margem bruta positiva.

### B. Tabela de Custos API (Referência)

**Gemini 3 Pro Image (modelo em uso):**

| Volume Mensal | Custo API | Custo/Imagem |
|---------------|-----------|--------------|
| 1.000 imgs | R$ 670 | R$ 0,67 |
| 10.000 imgs | R$ 6.700 | R$ 0,67 |
| 100.000 imgs | R$ 67.000 | R$ 0,67 |

**Gemini 2.5 Flash Image (alternativa):**

| Volume Mensal | Custo API | Custo/Imagem |
|---------------|-----------|--------------|
| 1.000 imgs | R$ 200 | R$ 0,20 |
| 10.000 imgs | R$ 2.000 | R$ 0,20 |
| 100.000 imgs | R$ 20.000 | R$ 0,20 |

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
| 1.1 | Fevereiro/2026 | - | Modelo em uso: Gemini 3 Pro Image. Custos e margens atualizados (R$ 0,67/img). Impacto na precificação e recomendações (4.1.1, 6.2, anexo B). |

---

> **Nota**: Este documento deve ser atualizado conforme mudanças nas APIs, concorrência ou estratégia de negócio. Valores de cotação de moeda e preços de API podem variar.
