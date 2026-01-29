<template>
  <div class="h-screen w-screen flex bg-slate-100 dark:bg-slate-950 overflow-hidden">
    <!-- Toolbar lateral esquerda -->
    <aside class="w-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-4 gap-3">
      <!-- Logo -->
      <NuxtLink 
        to="/" 
        class="w-11 h-11 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-105 transition-all"
        title="Voltar ao início"
      >
        <span class="text-white font-bold text-sm italic">EI</span>
      </NuxtLink>

      <div class="w-8 h-px bg-slate-200 dark:bg-slate-700 my-1" />

      <!-- Ferramentas rápidas -->
      <div class="flex flex-col gap-1">
        <button 
          class="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all group"
          title="Nova imagem"
          @click="focusInput"
        >
          <Icon name="add_photo_alternate" :size="22" class="group-hover:scale-110 transition-transform" />
        </button>
        <button 
          v-if="generatedImages.length > 0"
          class="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all group"
          title="Download"
          @click="generatedImages.length > 0 && handleDownload(generatedImages[0])"
        >
          <Icon name="download" :size="22" class="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div class="flex-1" />

      <!-- Créditos -->
      <button 
        class="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-400/20 to-orange-500/20 text-amber-600 dark:text-amber-400 relative hover:from-amber-400/30 hover:to-orange-500/30 transition-all group"
        title="Seus créditos"
        @click="showCreditsModal = true"
      >
        <Icon name="bolt" :size="20" class="group-hover:scale-110 transition-transform" />
        <span class="absolute -bottom-1 -right-1 text-[10px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
          {{ chatStore.credits.credits }}
        </span>
      </button>

      <!-- Tema -->
      <ThemeToggle class="w-11 h-11" />

      <!-- Configurações -->
      <button 
        class="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
        title="Configurações"
        @click="showSettings = true"
      >
        <Icon name="settings" :size="22" class="group-hover:rotate-45 transition-transform" />
      </button>
    </aside>

    <!-- Área principal -->
    <div class="flex-1 flex">
      <!-- Canvas / Área de trabalho -->
      <div class="flex-1 flex flex-col">
        <!-- Header do canvas -->
        <header class="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-5">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                {{ chatStore.currentProject?.title || 'Novo projeto' }}
              </span>
            </div>
            <span v-if="generatedImages.length > 0" class="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {{ allImages.length }} {{ allImages.length === 1 ? 'imagem' : 'imagens' }}
            </span>
          </div>
          <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button 
              class="w-8 h-8 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all"
              :disabled="zoom <= 50"
              @click="zoom = Math.max(50, zoom - 25)"
            >
              <Icon name="remove" :size="18" />
            </button>
            <span class="text-sm font-medium text-slate-600 dark:text-slate-400 w-14 text-center">{{ zoom }}%</span>
            <button 
              class="w-8 h-8 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all"
              :disabled="zoom >= 200"
              @click="zoom = Math.min(200, zoom + 25)"
            >
              <Icon name="add" :size="18" />
            </button>
          </div>
        </header>

        <!-- Canvas -->
        <div class="flex-1 overflow-auto p-8 flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-100 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
          <!-- Estado vazio - mais atrativo -->
          <div 
            v-if="generatedImages.length === 0"
            class="w-full max-w-xl"
          >
            <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-8 text-center">
              <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center">
                <Icon name="auto_awesome" :size="40" class="text-violet-500" />
              </div>
              <h3 class="text-xl font-semibold text-slate-800 dark:text-white mb-2">Comece a criar</h3>
              <p class="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                Descreva sua ideia no chat ao lado e a IA irá gerar imagens incríveis para você
              </p>
              <div class="flex flex-wrap gap-2 justify-center">
                <button 
                  v-for="quickPrompt in quickPrompts"
                  :key="quickPrompt.label"
                  class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-violet-100 dark:hover:bg-violet-900/30 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 rounded-full text-sm font-medium transition-all flex items-center gap-2"
                  @click="handleQuickPrompt(quickPrompt.prompt)"
                >
                  <Icon :name="quickPrompt.icon" :size="16" />
                  {{ quickPrompt.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Imagens geradas -->
          <div 
            v-else 
            class="flex flex-wrap gap-6 justify-center transition-transform duration-300"
            :style="{ transform: `scale(${zoom / 100})` }"
          >
            <div 
              v-for="image in generatedImages" 
              :key="image.id"
              class="relative group cursor-pointer animate-fade-in"
              @click="selectedImage = image"
            >
              <img 
                :src="image.url" 
                :alt="image.prompt"
                class="max-h-[70vh] rounded-2xl shadow-2xl shadow-slate-300/50 dark:shadow-none object-contain ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl flex flex-col justify-end p-4">
                <div class="flex items-center justify-between">
                  <p class="text-white text-sm font-medium truncate max-w-[200px]">{{ image.prompt }}</p>
                  <div class="flex items-center gap-2">
                    <button 
                      class="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all hover:scale-110"
                      title="Download"
                      @click.stop="handleDownload(image)"
                    >
                      <Icon name="download" :size="18" class="text-white" />
                    </button>
                    <button 
                      class="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all hover:scale-110"
                      title="Criar variação"
                      @click.stop="handleVariation(image)"
                    >
                      <Icon name="auto_awesome" :size="18" class="text-white" />
                    </button>
                    <button 
                      class="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all hover:scale-110"
                      title="Expandir"
                      @click.stop="selectedImage = image"
                    >
                      <Icon name="fullscreen" :size="18" class="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Thumbnails das imagens geradas -->
        <Transition name="slide-up">
          <div 
            v-if="allImages.length > 0" 
            class="h-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3 px-5 overflow-x-auto custom-scrollbar"
          >
            <span class="text-xs font-medium text-slate-400 flex-shrink-0">Histórico:</span>
            <div 
              v-for="image in allImages" 
              :key="image.id"
              class="w-14 h-14 rounded-xl overflow-hidden cursor-pointer flex-shrink-0 border-2 transition-all hover:scale-105"
              :class="{
                'border-violet-500 ring-2 ring-violet-500/20': generatedImages.some(img => img.id === image.id),
                'border-transparent hover:border-slate-300 dark:hover:border-slate-600': !generatedImages.some(img => img.id === image.id)
              }"
              @click="showImageInCanvas(image)"
            >
              <img :src="image.url" class="w-full h-full object-cover" />
            </div>
          </div>
        </Transition>
      </div>

      <!-- Painel de Chat IA -->
      <aside 
        class="w-[420px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col relative shadow-xl shadow-slate-200/20 dark:shadow-none"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <!-- Overlay de drag and drop -->
        <Transition name="fade">
          <div 
            v-if="isDragging"
            class="absolute inset-0 z-50 bg-violet-500/10 backdrop-blur-md border-2 border-dashed border-violet-500 rounded-2xl m-3 flex items-center justify-center"
          >
            <div class="text-center">
              <div class="w-16 h-16 mx-auto mb-3 bg-violet-500/20 rounded-2xl flex items-center justify-center">
                <Icon name="add_photo_alternate" :size="32" class="text-violet-500" />
              </div>
              <p class="text-violet-600 dark:text-violet-400 font-semibold">Solte as imagens aqui</p>
              <p class="text-xs text-violet-400 mt-1">Máximo {{ MAX_ATTACHED_IMAGES }} imagens</p>
            </div>
          </div>
        </Transition>
        
        <!-- Header do chat -->
        <header class="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-slate-50/50 dark:bg-slate-800/50">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Icon name="auto_awesome" :size="16" class="text-white" />
            </div>
            <div>
              <span class="text-sm font-semibold text-slate-800 dark:text-white block leading-tight">EditorIA</span>
              <span class="text-[10px] text-green-500 flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Online
              </span>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button 
              class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-violet-500"
              title="Meus projetos"
              @click="showHistory = !showHistory"
            >
              <Icon name="folder" :size="20" />
            </button>
            <button 
              class="p-2 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-lg transition-all text-slate-400 hover:text-violet-500"
              title="Novo projeto"
              @click="handleNewProject"
            >
              <Icon name="add_circle" :size="20" />
            </button>
          </div>
        </header>

        <!-- Área de mensagens -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto custom-scrollbar">
          <!-- Estado inicial (sem mensagens) -->
          <div 
            v-if="chatStore.currentMessages.length === 0" 
            class="h-full flex flex-col p-5"
          >
            <!-- Avatar e saudação -->
            <div class="flex flex-col items-center mb-6 pt-4">
              <div class="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
                <span class="text-white font-bold text-xl italic">EI</span>
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Olá! Sou o EditorIA</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center max-w-xs">
                Seu assistente criativo para gerar imagens incríveis com inteligência artificial
              </p>
            </div>

            <!-- Cards de sugestões -->
            <div class="space-y-2.5">
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Comece com uma ideia</p>
              <button
                v-for="suggestion in suggestions"
                :key="suggestion.title"
                class="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-violet-50 dark:hover:bg-violet-900/20 border border-slate-100 dark:border-slate-700 hover:border-violet-200 dark:hover:border-violet-800 rounded-xl transition-all text-left group"
                @click="handleSuggestionClick(suggestion.prompt)"
              >
                <div class="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br flex-shrink-0 shadow-md" :class="suggestion.gradient">
                  <div class="w-full h-full flex items-center justify-center">
                    <Icon :name="suggestion.icon" :size="22" class="text-white" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-slate-800 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors text-sm">
                    {{ suggestion.title }}
                  </p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {{ suggestion.description }}
                  </p>
                </div>
                <Icon name="arrow_forward" :size="18" class="text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
              </button>
            </div>

            <!-- Link para projetos -->
            <div class="mt-auto pt-6">
              <button 
                v-if="chatStore.sortedProjects.length > 1"
                class="w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-violet-500 py-2 border border-dashed border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 rounded-xl transition-all"
                @click="showHistory = true"
              >
                <Icon name="folder" :size="18" />
                <span>Ver meus {{ chatStore.sortedProjects.length }} projetos</span>
              </button>
            </div>
          </div>

          <!-- Mensagens -->
          <div v-else class="p-4 space-y-5">
            <div 
              v-for="message in chatStore.currentMessages" 
              :key="message.id"
              class="animate-fade-in"
            >
              <!-- Mensagem do usuário -->
              <div v-if="message.role === 'user'" class="flex justify-end">
                <div class="max-w-[85%]">
                  <!-- Imagens anexadas pelo usuário -->
                  <div v-if="message.attachedImages?.length" class="flex gap-1.5 justify-end mb-2">
                    <div 
                      v-for="(img, idx) in message.attachedImages" 
                      :key="idx"
                      class="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-violet-400 shadow-md"
                    >
                      <img :src="img" class="w-full h-full object-cover" />
                    </div>
                  </div>
                  <!-- Texto da mensagem -->
                  <div class="bg-gradient-to-br from-violet-500 to-purple-600 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-lg shadow-violet-500/20">
                    <p class="text-sm leading-relaxed">{{ message.content }}</p>
                  </div>
                </div>
              </div>

              <!-- Mensagem do assistente -->
              <div v-else class="space-y-2">
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-500/20">
                    <Icon name="auto_awesome" :size="16" class="text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <!-- Loading -->
                    <div v-if="message.isLoading" class="bg-slate-50 dark:bg-slate-800 rounded-2xl rounded-tl-md px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div class="flex gap-1">
                          <span class="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                          <span class="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                          <span class="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
                        </div>
                        <span class="text-sm text-slate-500">Criando sua imagem...</span>
                      </div>
                    </div>

                    <!-- Erro -->
                    <div v-else-if="message.error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl rounded-tl-md">
                      <div class="flex items-start gap-2">
                        <Icon name="error" :size="18" class="flex-shrink-0 mt-0.5" />
                        <div>
                          <p class="text-sm">{{ message.error }}</p>
                          <button 
                            class="text-xs font-medium mt-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-full transition-colors"
                            @click="handleRetry(message)"
                          >
                            Tentar novamente
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Conteúdo normal -->
                    <div v-else class="space-y-3">
                      <div class="bg-slate-50 dark:bg-slate-800 rounded-2xl rounded-tl-md px-4 py-3">
                        <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{{ message.content }}</p>
                      </div>
                      
                      <!-- Grid de imagens geradas -->
                      <div v-if="message.images?.length" class="grid gap-2" :class="message.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'">
                        <div 
                          v-for="image in message.images" 
                          :key="image.id"
                          class="relative aspect-square rounded-xl overflow-hidden cursor-pointer group ring-1 ring-slate-200 dark:ring-slate-700 shadow-lg"
                          @click="showImageInCanvas(image)"
                        >
                          <img :src="image.url" class="w-full h-full object-cover" />
                          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-3">
                            <span class="text-white text-xs font-medium flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                              <Icon name="fullscreen" :size="14" />
                              Ver no canvas
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <!-- Preview de imagens anexadas -->
          <Transition name="slide-up">
            <div v-if="attachedImages.length > 0" class="mb-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                    <Icon name="image" :size="14" class="text-violet-500" />
                  </div>
                  <span class="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {{ attachedImages.length }} {{ attachedImages.length === 1 ? 'imagem anexada' : 'imagens anexadas' }}
                  </span>
                </div>
                <button 
                  class="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                  @click="attachedImages = []"
                >
                  <Icon name="delete" :size="14" />
                  Remover
                </button>
              </div>
              <div class="flex gap-2 flex-wrap">
                <div 
                  v-for="(img, index) in attachedImages" 
                  :key="index"
                  class="relative group"
                >
                  <img 
                    :src="img" 
                    class="w-14 h-14 object-cover rounded-xl ring-2 ring-violet-200 dark:ring-violet-800 group-hover:ring-violet-500 transition-all shadow-md"
                  />
                  <button 
                    class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-md"
                    @click="removeAttachedImage(index)"
                  >
                    <Icon name="close" :size="12" />
                  </button>
                </div>
                <!-- Label para adicionar mais imagens -->
                <label 
                  v-if="attachedImages.length < MAX_ATTACHED_IMAGES"
                  class="w-14 h-14 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex items-center justify-center hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all cursor-pointer group"
                >
                  <Icon name="add" :size="20" class="text-slate-400 group-hover:text-violet-500 group-hover:scale-110 transition-all" />
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    class="hidden"
                    @change="handleImageUpload"
                  />
                </label>
              </div>
            </div>
          </Transition>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-none focus-within:ring-2 focus-within:ring-violet-500/30 focus-within:border-violet-400 transition-all">
            <textarea
              ref="inputRef"
              v-model="prompt"
              class="w-full bg-transparent border-none focus:ring-0 resize-none p-4 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 min-h-[52px] max-h-[200px]"
              :placeholder="getInputPlaceholder"
              :disabled="isGenerating"
              rows="1"
              @keydown="handleKeydown"
              @input="autoResize"
            />
            <div class="flex items-center justify-between px-3 pb-3">
              <div class="flex items-center gap-1">
                <!-- Label que ativa o input file -->
                <label 
                  class="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all relative cursor-pointer group"
                  :class="{ 
                    'text-violet-500': attachedImages.length > 0,
                    'opacity-50 cursor-not-allowed': isGenerating || attachedImages.length >= MAX_ATTACHED_IMAGES
                  }"
                  :title="attachedImages.length >= MAX_ATTACHED_IMAGES ? 'Limite de imagens atingido' : 'Anexar imagem de referência'"
                >
                  <Icon name="add_photo_alternate" :size="20" :class="attachedImages.length > 0 ? 'text-violet-500' : 'text-slate-400 group-hover:text-violet-500'" class="transition-colors" />
                  <span 
                    v-if="attachedImages.length > 0" 
                    class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-violet-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold"
                  >
                    {{ attachedImages.length }}
                  </span>
                  <input 
                    ref="fileInputRef"
                    type="file" 
                    accept="image/*"
                    multiple
                    class="hidden"
                    :disabled="isGenerating || attachedImages.length >= MAX_ATTACHED_IMAGES"
                    @change="handleImageUpload"
                  />
                </label>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] text-slate-400 hidden sm:block">Enter para enviar</span>
                <button
                  class="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md"
                  :class="{
                    'bg-gradient-to-br from-violet-500 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/30 hover:scale-105': canSubmit,
                    'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed': !canSubmit
                  }"
                  :disabled="!canSubmit"
                  @click="handleSubmit"
                >
                  <Icon v-if="!isGenerating" name="arrow_upward" :size="20" />
                  <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </button>
              </div>
            </div>
          </div>
          
          <!-- Dica de atalhos -->
          <p class="text-[10px] text-slate-400 text-center mt-2">
            Shift+Enter nova linha · Ctrl+V colar imagens · Arraste para anexar
          </p>
        </div>
      </aside>
    </div>

    <!-- Modal de Projetos -->
    <Teleport to="body">
      <Transition name="slide">
        <div 
          v-if="showHistory" 
          class="fixed inset-0 z-50"
          @click.self="showHistory = false"
        >
          <div class="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 shadow-2xl flex flex-col">
            <header class="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
              <h3 class="font-semibold">Meus Projetos</h3>
              <button 
                class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                @click="showHistory = false"
              >
                <Icon name="close" :size="20" />
              </button>
            </header>
            <div class="flex-1 overflow-y-auto p-4 space-y-2">
              <button
                v-for="project in chatStore.sortedProjects"
                :key="project.id"
                class="w-full text-left p-3 rounded-xl transition-colors flex gap-3"
                :class="{
                  'bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800': project.id === chatStore.currentProjectId,
                  'hover:bg-slate-50 dark:hover:bg-slate-800': project.id !== chatStore.currentProjectId
                }"
                @click="selectProject(project.id)"
              >
                <!-- Thumbnail -->
                <div class="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                  <img 
                    v-if="project.thumbnail" 
                    :src="project.thumbnail" 
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <Icon name="image" :size="20" class="text-slate-300 dark:text-slate-600" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-sm truncate">{{ project.title }}</p>
                  <p class="text-xs text-slate-400 mt-1">{{ formatDate(project.updatedAt) }}</p>
                </div>
              </button>
            </div>
            <!-- Botão novo projeto -->
            <div class="p-4 border-t border-slate-200 dark:border-slate-800">
              <button
                class="w-full py-2 px-4 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                @click="handleNewProject(); showHistory = false"
              >
                <Icon name="add" :size="18" />
                Novo Projeto
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal de imagem -->
    <ImageModal
      :is-open="!!selectedImage"
      :image="selectedImage"
      :has-previous="hasPreviousImage"
      :has-next="hasNextImage"
      @close="selectedImage = null"
      @previous="navigateImage(-1)"
      @next="navigateImage(1)"
      @variation="handleVariation"
    />

    <!-- Modal de configurações -->
    <SettingsModal
      :is-open="showSettings"
      :settings="chatStore.settings"
      :credits="chatStore.credits"
      @close="showSettings = false"
      @save="handleSaveSettings"
      @clear-data="chatStore.clearAllData"
    />

    <!-- Modal de créditos -->
    <CreditsModal
      :is-open="showCreditsModal"
      :credits="chatStore.credits"
      @close="showCreditsModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { GeneratedImage } from '~/stores/chat'
import type { ImageSize } from '~/composables/useNanobanana'
import ImageModal from '~/components/chat/ImageModal.vue'
import SettingsModal from '~/components/chat/SettingsModal.vue'
import CreditsModal from '~/components/chat/CreditsModal.vue'

useHead({
  title: 'EditorIA - Editor de Imagens com IA',
})

const chatStore = useChatStore()
const nanobanana = useNanobanana()

// Estado
const showSettings = ref(false)
const showCreditsModal = ref(false)
const showHistory = ref(false)
const isGenerating = ref(false)
const selectedImage = ref<GeneratedImage | null>(null)
const generatedImages = ref<GeneratedImage[]>([])
const messagesContainer = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const prompt = ref('')
const attachedImages = ref<string[]>([]) // Suporte para múltiplas imagens
const zoom = ref(100)
const isDragging = ref(false)

// Constantes
const MAX_ATTACHED_IMAGES = 4

// Sugestões de criação e conversa
const suggestions = [
  { 
    title: 'Gerar Ilustração', 
    description: 'Crie ilustrações únicas com IA',
    prompt: 'Crie uma ilustração artística de uma cidade futurista ao pôr do sol, estilo anime, cores vibrantes',
    icon: 'palette',
    gradient: 'from-pink-500 to-rose-500'
  },
  { 
    title: 'Ideias de Design', 
    description: 'Peça sugestões criativas à IA',
    prompt: 'Me dê 5 ideias criativas para um logo de uma startup de tecnologia sustentável',
    icon: 'lightbulb',
    gradient: 'from-violet-500 to-purple-500'
  },
  { 
    title: 'Criar Logo', 
    description: 'Gere logos e identidades visuais',
    prompt: 'Crie um logo minimalista e moderno para uma startup de tecnologia, estilo clean',
    icon: 'brush',
    gradient: 'from-amber-500 to-orange-500'
  },
]

// Prompts rápidos para o estado vazio do canvas
const quickPrompts = [
  { label: 'Ilustração', icon: 'palette', prompt: 'Crie uma ilustração digital colorida e moderna' },
  { label: 'Logo', icon: 'hexagon', prompt: 'Crie um logo minimalista e elegante' },
  { label: 'Arte 3D', icon: 'view_in_ar', prompt: 'Crie uma arte 3D abstrata e futurista' },
]

// Computed
const allImages = computed(() => chatStore.currentImages)

const currentImageIndex = computed(() => {
  if (!selectedImage.value) return -1
  return allImages.value.findIndex(img => img.id === selectedImage.value?.id)
})

const hasPreviousImage = computed(() => currentImageIndex.value > 0)
const hasNextImage = computed(() => currentImageIndex.value < allImages.value.length - 1)

const canSubmit = computed(() => {
  const hasContent = prompt.value.trim() || attachedImages.value.length > 0
  return hasContent && !isGenerating.value
})

const getInputPlaceholder = computed(() => {
  if (attachedImages.value.length > 0) return 'Descreva o que fazer com as imagens (editar, inspirar, reaproveitar...)'
  return 'Converse com a IA, peça ideias ou gere imagens...'
})

// Inicialização
onMounted(async () => {
  chatStore.loadFromLocalStorage()
  await fetchCredits()
  
  // Adiciona listener para colar imagens
  document.addEventListener('paste', handlePaste)
  
  // Verifica se há um prompt inicial (vindo de um template)
  if (typeof window !== 'undefined') {
    const initialPrompt = sessionStorage.getItem('editoria_initial_prompt')
    if (initialPrompt) {
      prompt.value = initialPrompt
      sessionStorage.removeItem('editoria_initial_prompt')
      // Foca no input e redimensiona
      nextTick(() => {
        inputRef.value?.focus()
        autoResize()
      })
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('paste', handlePaste)
})

// Watch para scroll automático
watch(() => chatStore.currentMessages.length, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

// Funções
const fetchCredits = async () => {
  try {
    const credits = await nanobanana.getCredits()
    chatStore.setCredits(credits)
  } catch (err) {
    console.error('Erro ao buscar créditos:', err)
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const autoResize = () => {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
    inputRef.value.style.height = `${Math.min(inputRef.value.scrollHeight, 120)}px`
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSubmit()
  }
}

const handleNewProject = () => {
  chatStore.createProject()
  generatedImages.value = []
}

const selectProject = (projectId: string) => {
  chatStore.selectProject(projectId)
  showHistory.value = false
  // Mostra a última imagem do projeto no canvas
  const images = chatStore.currentImages
  if (images.length > 0) {
    generatedImages.value = [images[images.length - 1]]
  } else {
    generatedImages.value = []
  }
}

const handleSuggestionClick = (suggestionPrompt: string) => {
  prompt.value = suggestionPrompt
  handleSubmit()
}

const handleQuickPrompt = (quickPrompt: string) => {
  prompt.value = quickPrompt
  inputRef.value?.focus()
}

const focusInput = () => {
  inputRef.value?.focus()
}

const handleSubmit = async () => {
  const hasContent = prompt.value.trim() || attachedImages.value.length > 0
  if (!hasContent || isGenerating.value) return

  const currentPrompt = prompt.value.trim() || 'O que você acha dessa imagem? Me dê sugestões.'
  const currentAttachedImages = [...attachedImages.value]
  
  prompt.value = ''
  attachedImages.value = []
  
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
  }

  // Adiciona mensagem do usuário com as imagens anexadas
  chatStore.addUserMessage(currentPrompt, currentAttachedImages)

  // Adiciona mensagem do assistente (loading)
  const assistantMessage = chatStore.addAssistantMessage(
    'Pensando...',
    undefined,
    true
  )

  isGenerating.value = true

  try {
    // Monta histórico para contexto
    const history = chatStore.currentMessages.slice(0, -1).map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      images: msg.images?.map(img => img.url)
    }))

    // Usa o chat conversacional
    const response = await nanobanana.chat({
      message: currentPrompt,
      history,
      attachedImages: currentAttachedImages,
      imageSettings: {
        aspectRatio: chatStore.settings.defaultImageSize
      }
    })

    // Processa imagens geradas (se houver)
    const newImages: GeneratedImage[] = response.images.map((img, index) => ({
      id: `img-${Date.now()}-${index}`,
      url: img.url,
      prompt: currentPrompt,
      createdAt: new Date(),
      size: chatStore.settings.defaultImageSize
    }))

    // Atualiza a mensagem do assistente
    chatStore.updateMessage(assistantMessage.id, {
      content: response.text,
      images: newImages.length > 0 ? newImages : undefined,
      isLoading: false
    })

    // Se gerou imagens, mostra no canvas
    if (newImages.length > 0) {
      generatedImages.value = newImages
      
      // Deduz créditos apenas se gerou imagens
      if (response.creditsUsed > 0) {
        chatStore.deductCredits(response.creditsUsed)
        await fetchCredits()
      }
    }

  } catch (err: any) {
    chatStore.setMessageError(assistantMessage.id, err.message || 'Erro ao processar mensagem')
  } finally {
    isGenerating.value = false
  }
}

const handleRetry = (message: any) => {
  const messages = chatStore.currentMessages
  const messageIndex = messages.findIndex(m => m.id === message.id)
  
  if (messageIndex > 0) {
    const userMessage = messages[messageIndex - 1]
    if (userMessage.role === 'user') {
      prompt.value = userMessage.content
      handleSubmit()
    }
  }
}

const showImageInCanvas = (image: GeneratedImage) => {
  generatedImages.value = [image]
}

const handleDownload = (image: GeneratedImage) => {
  const link = document.createElement('a')
  link.href = image.url
  link.download = `editoria-${image.id}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleVariation = (image: GeneratedImage) => {
  selectedImage.value = null
  prompt.value = `Crie uma variação desta imagem: ${image.prompt}`
  attachedImages.value = [image.url]
  handleSubmit()
}

const navigateImage = (direction: number) => {
  const newIndex = currentImageIndex.value + direction
  if (newIndex >= 0 && newIndex < allImages.value.length) {
    selectedImage.value = allImages.value[newIndex]
  }
}

const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  
  if (files && files.length > 0) {
    // Calcula quantas imagens ainda podem ser adicionadas
    const remainingSlots = MAX_ATTACHED_IMAGES - attachedImages.value.length
    const filesToProcess = Array.from(files).slice(0, remainingSlots)
    
    filesToProcess.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result && attachedImages.value.length < MAX_ATTACHED_IMAGES) {
          attachedImages.value.push(result)
        }
      }
      reader.readAsDataURL(file)
    })
  }
  target.value = ''
}

const removeAttachedImage = (index: number) => {
  attachedImages.value.splice(index, 1)
}

// Drag and drop handlers
const handleDragOver = (e: DragEvent) => {
  if (e.dataTransfer?.types.includes('Files')) {
    isDragging.value = true
  }
}

const handleDragLeave = (e: DragEvent) => {
  // Verifica se realmente saiu da área (não apenas entrou em um elemento filho)
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x = e.clientX
  const y = e.clientY
  
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    isDragging.value = false
  }
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  
  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return
  
  processImageFiles(Array.from(files))
}

const handlePaste = (e: ClipboardEvent) => {
  const items = e.clipboardData?.items
  if (!items) return
  
  const imageFiles: File[] = []
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        imageFiles.push(file)
      }
    }
  }
  
  if (imageFiles.length > 0) {
    e.preventDefault()
    processImageFiles(imageFiles)
  }
}

const processImageFiles = (files: File[]) => {
  // Filtra apenas imagens
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  
  // Calcula quantas imagens ainda podem ser adicionadas
  const remainingSlots = MAX_ATTACHED_IMAGES - attachedImages.value.length
  const filesToProcess = imageFiles.slice(0, remainingSlots)
  
  filesToProcess.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (result && attachedImages.value.length < MAX_ATTACHED_IMAGES) {
        attachedImages.value.push(result)
      }
    }
    reader.readAsDataURL(file)
  })
}

const handleSaveSettings = (settings: any) => {
  chatStore.updateSettings(settings)
}

const formatDate = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Ontem'
  if (days < 7) return `${days} dias atrás`
  return new Date(date).toLocaleDateString('pt-BR')
}
</script>

<style scoped>
/* Transição do painel lateral */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from > div,
.slide-leave-to > div {
  transform: translateX(100%);
}

/* Transição slide-up */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Transição fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animação fade-in */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgb(203 213 225 / 0.5);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgb(148 163 184 / 0.7);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgb(51 65 85 / 0.5);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgb(71 85 105 / 0.7);
}
</style>
