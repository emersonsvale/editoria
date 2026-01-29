# Componentes do Projeto Art.io

Esta documentação descreve todos os componentes reutilizáveis do projeto, organizados por categoria.

## 📁 Estrutura de Componentes

```
components/
├── layout/          # Componentes de layout (Navbar, Sidebar, Header)
├── ui/              # Componentes de UI básicos (Button, Badge, Card, Inputs)
├── cards/           # Componentes de cards (ProjectCard, AssetCard, DesignCard)
├── features/        # Componentes de funcionalidades (AIInput, UpgradeBanner, etc.)
└── editor/          # Componentes do Editor de Design (Canvas, Layers, AI, Export)
```

## 🎨 Componentes de Layout

### AppNavbar
Barra de navegação principal do aplicativo.

**Props:**
- `language` (string, default: 'Português') - Idioma selecionado
- `upgradeText` (string, default: 'Fazer upgrade') - Texto do botão de upgrade
- `upgradeBadge` (string|number, default: '50') - Badge do upgrade
- `userName` (string, default: 'User profile') - Nome do usuário
- `userAvatar` (string) - URL do avatar do usuário

**Uso:**
```vue
<AppNavbar 
  :upgrade-badge="50"
  user-name="John Doe"
  user-avatar="/avatar.jpg"
/>
```

### AppSidebar
Sidebar vertical com ações rápidas.

**Props:**
- `items` (array) - Array de itens do sidebar
  - `name` (string) - Nome do item
  - `icon` (string) - Nome do ícone
  - `active` (boolean) - Se o item está ativo

**Events:**
- `item-click` - Emitido quando um item é clicado

**Uso:**
```vue
<AppSidebar 
  :items="[
    { name: 'add', icon: 'add', active: true },
    { name: 'home', icon: 'home' }
  ]"
  @item-click="handleItemClick"
/>
```

### AppHeader
Header reutilizável para páginas internas.

**Props:**
- `title` (string, default: 'EditorIA') - Título do header
- `variant` ('default' | 'transparent', default: 'default') - Variante do header
- `padding` ('default' | 'large', default: 'default') - Tamanho do padding
- `containerMaxWidth` (string, default: 'max-w-[1440px]') - Largura máxima do container

**Slots:**
- `logo` - Slot para logo customizado
- `nav` - Slot para navegação
- `actions` - Slot para ações do header

**Uso:**
```vue
<AppHeader title="Media Manager" variant="transparent">
  <template #nav>
    <nav>...</nav>
  </template>
  <template #actions>
    <button>Upload</button>
  </template>
</AppHeader>
```

## 🎯 Componentes de UI

### Button
Botão reutilizável com múltiplas variantes.

**Props:**
- `variant` ('primary' | 'secondary' | 'outline' | 'ghost' | 'accent', default: 'primary')
- `size` ('sm' | 'md' | 'lg', default: 'md')
- `icon` (string) - Nome do ícone
- `iconRight` (boolean, default: false) - Ícone à direita
- `iconSize` (number, default: 16) - Tamanho do ícone
- `badge` (string|number) - Badge do botão
- `disabled` (boolean, default: false)
- `type` ('button' | 'submit' | 'reset', default: 'button')
- `fullWidth` (boolean, default: false)

**Events:**
- `click` - Emitido quando o botão é clicado

**Uso:**
```vue
<Button 
  variant="primary" 
  icon="add" 
  :icon-size="20"
  @click="handleClick"
>
  Adicionar
</Button>
```

### Badge
Badge/tag para destacar informações.

**Props:**
- `variant` ('default' | 'accent' | 'primary' | 'success' | 'warning' | 'error', default: 'default')
- `size` ('sm' | 'md' | 'lg', default: 'sm')

**Uso:**
```vue
<Badge variant="accent" size="sm">NEW</Badge>
```

### Card
Card genérico reutilizável.

**Props:**
- `variant` ('default' | 'outlined' | 'elevated' | 'dashed', default: 'default')
- `padding` ('none' | 'sm' | 'md' | 'lg', default: 'md')
- `hover` (boolean, default: false) - Efeito hover

**Uso:**
```vue
<Card variant="elevated" padding="lg" :hover="true">
  Conteúdo do card
</Card>
```

### SearchInput
Input de busca com ícone.

**Props:**
- `modelValue` (string) - Valor do input (v-model)
- `placeholder` (string, default: 'Search...')
- `type` (string, default: 'text')
- `size` ('sm' | 'md' | 'lg', default: 'md')

**Events:**
- `update:modelValue` - Atualiza o valor
- `focus` - Quando o input recebe foco
- `blur` - Quando o input perde foco

**Uso:**
```vue
<SearchInput 
  v-model="searchQuery"
  placeholder="Buscar assets..."
  @focus="handleFocus"
/>
```

### TextArea
Textarea customizado com ações.

**Props:**
- `modelValue` (string) - Valor do textarea (v-model)
- `placeholder` (string, default: 'Type something...')
- `rows` (number, default: 3)
- `showActions` (boolean, default: false) - Mostra área de ações
- `showBadge` (boolean, default: false) - Mostra badge de status

**Slots:**
- `actions-left` - Ações à esquerda
- `actions-right` - Ações à direita

**Events:**
- `update:modelValue` - Atualiza o valor
- `focus` - Quando recebe foco
- `blur` - Quando perde foco

**Uso:**
```vue
<TextArea 
  v-model="text"
  :show-actions="true"
  :show-badge="true"
>
  <template #actions-left>
    <button>Attach</button>
  </template>
  <template #actions-right>
    <button>Send</button>
  </template>
</TextArea>
```

### FilterTabs
Tabs para filtros.

**Props:**
- `tabs` (array) - Array de tabs
  - `label` (string) - Label da tab
  - `value` (string) - Valor da tab
- `activeTab` (string) - Tab ativa

**Events:**
- `update:activeTab` - Atualiza a tab ativa

**Uso:**
```vue
<FilterTabs 
  :tabs="[
    { label: 'Todos', value: 'all' },
    { label: 'Branding', value: 'branding' }
  ]"
  v-model:active-tab="activeFilter"
/>
```

### ProgressBar
Barra de progresso.

**Props:**
- `value` (number) - Valor do progresso (0-100)
- `label` (string) - Label do progresso
- `description` (string) - Descrição adicional
- `showIcon` (boolean, default: false) - Mostra ícone
- `icon` (string, default: 'refresh') - Nome do ícone

**Uso:**
```vue
<ProgressBar 
  :value="75"
  label="Preparando assets..."
  description="Magic Resize está otimizando..."
  :show-icon="true"
/>
```

## 🎴 Componentes de Cards

### ProjectCard
Card para exibir projetos.

**Props:**
- `title` (string) - Título do projeto
- `image` (string) - URL da imagem
- `lastUpdated` (string) - Data da última atualização

**Events:**
- `click` - Quando o card é clicado

**Uso:**
```vue
<ProjectCard 
  title="Instagram Coffee Promo"
  image="/project.jpg"
  last-updated="2024-05-15"
  @click="openProject"
/>
```

### NewProjectCard
Card para criar novo projeto.

**Props:**
- `label` (string, default: 'Novo projeto') - Label do card

**Events:**
- `click` - Quando o card é clicado

**Uso:**
```vue
<NewProjectCard @click="createProject" />
```

### DesignCard
Card para exibir designs no masonry grid.

**Props:**
- `title` (string) - Título do design
- `image` (string) - URL da imagem
- `author` (object) - Informações do autor
  - `name` (string) - Nome do autor
  - `avatar` (string) - URL do avatar (opcional)
  - `avatarColor` (string) - Cor do avatar (opcional)
  - `initials` (string) - Iniciais (opcional)
- `stats` (object) - Estatísticas
  - `views` (string|number) - Número de visualizações
  - `likes` (string|number) - Número de curtidas

**Uso:**
```vue
<DesignCard 
  title="Abstract Art"
  image="/design.jpg"
  :author="{ name: 'ludwig', avatarColor: 'bg-blue-500' }"
  :stats="{ views: 8321, likes: 136 }"
/>
```

### AssetCard
Card para exibir assets de mídia.

**Props:**
- `name` (string) - Nome do asset
- `image` (string) - URL da imagem (opcional)
- `icon` (string, default: 'image') - Ícone quando não há imagem
- `subtitle` (string) - Subtítulo do asset

**Events:**
- `click` - Quando o card é clicado

**Uso:**
```vue
<AssetCard 
  name="Logo Primary"
  image="/logo.png"
  subtitle="PNG - 2.4 MB"
  @click="selectAsset"
/>
```

## ⚡ Componentes de Features

### UpgradeBanner
Banner de upgrade/promoção.

**Props:**
- `badgeText` (string, default: 'NEW') - Texto do badge
- `message` (string) - Mensagem principal
- `actionText` (string, default: 'Atualizar') - Texto da ação

**Events:**
- `click` - Quando o banner é clicado

**Uso:**
```vue
<UpgradeBanner 
  message="Faça o upgrade agora!"
  @click="handleUpgrade"
/>
```

### AIInput
Input de IA com ações integradas.

**Props:**
- `modelValue` (string) - Valor do input (v-model)
- `placeholder` (string) - Placeholder
- `showBadge` (boolean, default: true) - Mostra badge de status

**Events:**
- `update:modelValue` - Atualiza o valor
- `submit` - Quando o formulário é submetido

**Uso:**
```vue
<AIInput 
  v-model="aiQuery"
  placeholder="Peça ao EditorIA..."
  @submit="handleSubmit"
/>
```

### QuickActions
Ações rápidas com botões.

**Props:**
- `actions` (array) - Array de ações
  - `id` (string) - ID da ação
  - `label` (string) - Label da ação
  - `icon` (string) - Nome do ícone
  - `active` (boolean) - Se está ativa

**Events:**
- `action-click` - Quando uma ação é clicada

**Uso:**
```vue
<QuickActions 
  :actions="[
    { id: '1', label: 'Nano Banana Pro', icon: 'waving_hand', active: true },
    { id: '2', label: 'Instagram Post', icon: 'grid_view' }
  ]"
  @action-click="handleAction"
/>
```

### UserProfile
Componente de perfil do usuário.

**Props:**
- `name` (string) - Nome do usuário
- `avatar` (string) - URL do avatar (opcional)
- `avatarColor` (string) - Cor do avatar quando não há imagem
- `initials` (string) - Iniciais (opcional, calculado automaticamente)
- `plan` (string) - Plano do usuário

**Uso:**
```vue
<UserProfile 
  name="Jane Doe"
  avatar="/avatar.jpg"
  plan="Pro Plan"
/>
```

### ThemeToggleButton
Botão flutuante para alternar tema.

**Uso:**
```vue
<ThemeToggleButton />
```

## 📝 Notas

- Todos os componentes são auto-importados pelo Nuxt 3
- Os componentes usam o sistema de ícones Lucide através do componente `Icon`
- Todos os componentes suportam dark mode através das classes Tailwind
- Os componentes seguem o design system do projeto com as cores definidas no `tailwind.config.js`
