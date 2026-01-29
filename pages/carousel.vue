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

      <!-- Ferramentas -->
      <div class="flex flex-col gap-1">
        <button 
          class="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all group"
          title="Gerar imagens"
          :disabled="!hasCarousel || carouselIsGeneratingImages"
          @click="handleGenerateAllImages"
        >
          <Icon name="auto_awesome" :size="22" class="group-hover:scale-110 transition-transform" />
        </button>
        <button 
          v-if="hasCarousel"
          class="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all group"
          title="Baixar slides"
          @click="downloadAllSlides"
        >
          <Icon name="download" :size="22" class="group-hover:scale-110 transition-transform" />
        </button>
        <button 
          v-if="hasCarousel"
          class="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all group"
          title="Novo carrossel"
          @click="startNew"
        >
          <Icon name="add" :size="22" class="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div class="flex-1" />

      <!-- Tema -->
      <ThemeToggle class="w-11 h-11" />
    </aside>

    <!-- Área principal -->
    <div class="flex-1 flex">
      <!-- Canvas / Área de slides -->
      <div class="flex-1 flex flex-col">
        <!-- Header -->
        <header class="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-5">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <Icon name="view_carousel" :size="20" class="text-violet-500" />
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                Criador de Carrosséis
              </span>
            </div>
            <span v-if="hasCarousel" class="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {{ currentCarousel?.slides?.length || 0 }} slides
            </span>
          </div>
          
          <!-- Barra de progresso -->
          <div v-if="carouselIsGeneratingImages" class="flex items-center gap-3">
            <span class="text-xs text-slate-500">Gerando imagens...</span>
            <div class="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500"
                :style="{ width: `${carouselProgress}%` }"
              />
            </div>
            <span class="text-xs text-violet-500 font-medium">{{ carouselProgress }}%</span>
          </div>
        </header>

        <!-- Canvas com slides -->
        <div class="flex-1 overflow-auto p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-100 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
          <!-- Estado vazio -->
          <div 
            v-if="!hasCarousel"
            class="h-full flex items-center justify-center"
          >
            <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-8 text-center max-w-md">
              <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center">
                <Icon name="view_carousel" :size="40" class="text-violet-500" />
              </div>
              <h3 class="text-xl font-semibold text-slate-800 dark:text-white mb-2">Crie seu Carrossel</h3>
              <p class="text-slate-500 dark:text-slate-400 mb-4 text-sm">
                Preencha o formulário ao lado com seu tema e a IA irá gerar o conteúdo e as imagens automaticamente
              </p>
              <div class="flex items-center justify-center gap-2 text-xs text-slate-400">
                <Icon name="arrow_forward" :size="16" />
                <span>Use o formulário à direita para começar</span>
              </div>
            </div>
          </div>

          <!-- Slides gerados -->
          <div 
            v-else 
            class="flex flex-wrap gap-4 justify-center items-start"
          >
            <div 
              v-for="(slide, index) in (currentCarousel?.slides || [])"
              :key="slide.id"
              class="w-72 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
            >
              <!-- Preview da imagem -->
              <div class="aspect-square relative bg-slate-100 dark:bg-slate-800">
                <img 
                  v-if="slide.image"
                  :src="slide.image"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <div class="text-center">
                    <Icon name="image" :size="40" class="text-slate-300 dark:text-slate-600 mb-2" />
                    <p class="text-xs text-slate-400">Sem imagem</p>
                  </div>
                </div>

                <!-- Número do slide -->
                <div class="absolute top-2 left-2 w-7 h-7 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span class="text-white text-xs font-bold">{{ index + 1 }}</span>
                </div>

                <!-- Loading de geração de imagem -->
                <div v-if="slide.isGeneratingImage" class="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div class="text-center">
                    <div class="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
                    <p class="text-white text-xs">Gerando...</p>
                  </div>
                </div>

                <!-- Ações do slide -->
                <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    class="p-1.5 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg text-white transition-colors"
                    title="Regenerar imagem"
                    :disabled="slide.isGeneratingImage"
                    @click="handleRegenerateImage(index)"
                  >
                    <Icon name="refresh" :size="14" />
                  </button>
                  <button
                    class="p-1.5 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg text-white transition-colors"
                    title="Editar slide"
                    @click="openSlideEditor(index)"
                  >
                    <Icon name="edit" :size="14" />
                  </button>
                  <button
                    v-if="(currentCarousel?.slides?.length || 0) > 1"
                    class="p-1.5 bg-black/50 hover:bg-red-500/70 backdrop-blur-sm rounded-lg text-white transition-colors"
                    title="Remover slide"
                    @click="carousel.removeSlide(index)"
                  >
                    <Icon name="delete" :size="14" />
                  </button>
                </div>
              </div>

              <!-- Conteúdo do slide -->
              <div class="p-3">
                <h4 class="font-semibold text-sm text-slate-800 dark:text-white truncate">{{ slide.title }}</h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{{ slide.content }}</p>
              </div>
            </div>

            <!-- Botão adicionar slide -->
            <button
              class="w-72 aspect-[3/4] bg-white/50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-500 transition-colors flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-violet-500"
              @click="carousel.addSlide()"
            >
              <Icon name="add" :size="32" />
              <span class="text-sm font-medium">Adicionar slide</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar direita - Formulário -->
      <aside class="w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        <div class="flex-1 overflow-y-auto">
          <!-- Formulário de criação -->
          <div v-if="!hasCarousel" class="p-5">
            <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">Criar Carrossel</h2>
            
            <form @submit.prevent="handleGenerate" class="space-y-5">
              <!-- Rede social -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Rede Social
                </label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    class="flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left"
                    :class="{
                      'border-pink-500 bg-pink-50 dark:bg-pink-900/20': form.socialNetwork === 'instagram',
                      'border-slate-200 dark:border-slate-700 hover:border-pink-300': form.socialNetwork !== 'instagram'
                    }"
                    @click="form.socialNetwork = 'instagram'"
                  >
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 flex items-center justify-center">
                      <Icon name="photo_camera" :size="16" class="text-white" />
                    </div>
                    <div>
                      <p class="font-medium text-sm text-slate-800 dark:text-white">Instagram</p>
                      <p class="text-[10px] text-slate-500">30 hashtags</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    class="flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left"
                    :class="{
                      'border-blue-500 bg-blue-50 dark:bg-blue-900/20': form.socialNetwork === 'linkedin',
                      'border-slate-200 dark:border-slate-700 hover:border-blue-300': form.socialNetwork !== 'linkedin'
                    }"
                    @click="form.socialNetwork = 'linkedin'"
                  >
                    <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                      <Icon name="work" :size="16" class="text-white" />
                    </div>
                    <div>
                      <p class="font-medium text-sm text-slate-800 dark:text-white">LinkedIn</p>
                      <p class="text-[10px] text-slate-500">Profissional</p>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Tema -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tema do carrossel
                </label>
                <textarea
                  v-model="form.topic"
                  class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 resize-none"
                  placeholder="Ex: 5 dicas para aumentar sua produtividade"
                  rows="3"
                  required
                />
                <!-- Exemplos -->
                <div class="flex flex-wrap gap-1 mt-2">
                  <button
                    v-for="example in exampleTopics"
                    :key="example"
                    type="button"
                    class="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-violet-100 dark:hover:bg-violet-900/30 text-slate-500 hover:text-violet-600 rounded text-[10px] transition-colors"
                    @click="form.topic = example"
                  >
                    {{ example }}
                  </button>
                </div>
              </div>

              <!-- Tom -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tom
                </label>
                <div class="grid grid-cols-2 gap-1.5">
                  <button
                    v-for="tone in tones"
                    :key="tone.value"
                    type="button"
                    class="px-3 py-2 rounded-lg text-xs font-medium transition-all"
                    :class="{
                      'bg-violet-500 text-white': form.tone === tone.value,
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200': form.tone !== tone.value
                    }"
                    @click="form.tone = tone.value"
                  >
                    {{ tone.label }}
                  </button>
                </div>
              </div>

              <!-- Slides -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Quantidade: {{ form.numberOfSlides }} slides
                </label>
                <input
                  v-model.number="form.numberOfSlides"
                  type="range"
                  min="3"
                  max="10"
                  class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
              </div>

              <!-- Upload de imagens -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Imagens de referência <span class="text-slate-400 font-normal">(opcional)</span>
                </label>
                
                <!-- Preview -->
                <div v-if="form.inspirationImages.length > 0" class="flex gap-2 mb-2 flex-wrap">
                  <div
                    v-for="(img, index) in form.inspirationImages"
                    :key="index"
                    class="relative w-14 h-14 rounded-lg overflow-hidden group"
                  >
                    <img :src="img.preview" class="w-full h-full object-cover" />
                    <button
                      type="button"
                      class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      @click="removeInspirationImage(index)"
                    >
                      <Icon name="close" :size="16" class="text-white" />
                    </button>
                  </div>
                </div>

                <!-- Upload area -->
                <div
                  class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-3 text-center hover:border-violet-400 cursor-pointer transition-colors"
                  :class="{ 'border-violet-500 bg-violet-50 dark:bg-violet-900/20': isDragging }"
                  @click="triggerFileInput"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="handleDrop"
                >
                  <input
                    ref="fileInputRef"
                    type="file"
                    accept="image/*"
                    multiple
                    class="hidden"
                    @change="handleFileSelect"
                  />
                  <Icon name="cloud_upload" :size="24" class="text-slate-400 mx-auto mb-1" />
                  <p class="text-xs text-slate-500">
                    Arraste ou <span class="text-violet-500">clique</span> (até 5)
                  </p>
                </div>
              </div>

              <!-- Botão gerar -->
              <button
                type="button"
                class="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isLoading || !form.topic.trim()"
                @click="handleGenerate"
              >
                <div v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <Icon v-else name="auto_awesome" :size="20" />
                <span>{{ isLoading ? 'Gerando...' : 'Gerar Carrossel' }}</span>
              </button>
            </form>
          </div>

          <!-- Painel de edição (quando tem carrossel) -->
          <div v-else class="p-5 space-y-4">
            <!-- Info do carrossel -->
            <div class="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div 
                class="w-10 h-10 rounded-xl flex items-center justify-center"
                :class="currentCarousel?.socialNetwork === 'instagram' 
                  ? 'bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500' 
                  : 'bg-blue-600'"
              >
                <Icon :name="currentCarousel?.socialNetwork === 'instagram' ? 'photo_camera' : 'work'" :size="20" class="text-white" />
              </div>
              <div class="flex-1">
                <p class="font-semibold text-slate-800 dark:text-white capitalize">
                  {{ currentCarousel?.socialNetwork }}
                </p>
                <p class="text-xs text-slate-500 truncate">{{ currentCarousel?.topic }}</p>
              </div>
            </div>

            <!-- Caption -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Descrição</label>
                <button
                  class="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                  title="Copiar"
                  @click="copyCaption"
                >
                  <Icon name="content_copy" :size="14" class="text-slate-400" />
                </button>
              </div>
              <textarea
                :value="currentCarousel?.caption || ''"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none"
                rows="4"
                @input="updateCaption"
              />
            </div>

            <!-- Hashtags -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Hashtags <span class="text-slate-400">({{ currentCarousel?.hashtags?.length || 0 }})</span>
                </label>
                <button
                  class="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                  title="Copiar"
                  @click="copyHashtags"
                >
                  <Icon name="content_copy" :size="14" class="text-slate-400" />
                </button>
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="(hashtag, index) in (currentCarousel?.hashtags || [])"
                  :key="index"
                  class="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full text-xs group"
                >
                  #{{ hashtag }}
                  <button
                    class="w-3.5 h-3.5 rounded-full hover:bg-violet-200 dark:hover:bg-violet-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    @click="removeHashtag(index)"
                  >
                    <Icon name="close" :size="8" />
                  </button>
                </span>
              </div>
              <div class="mt-2 flex gap-2">
                <input
                  v-model="newHashtag"
                  type="text"
                  class="flex-1 px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="Adicionar hashtag"
                  @keydown.enter.prevent="addHashtag"
                />
                <button
                  class="px-3 py-1.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-xs font-medium"
                  @click="addHashtag"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Ações -->
            <div class="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                class="w-full py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                :disabled="carouselIsGeneratingImages"
                @click="handleGenerateAllImages"
              >
                <Icon name="auto_awesome" :size="16" />
                Gerar Todas as Imagens
              </button>
              <button
                class="w-full py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                @click="copyAll"
              >
                <Icon name="content_copy" :size="16" />
                Copiar Descrição + Hashtags
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Modal de edição de slide -->
    <Teleport to="body">
      <Transition name="fade">
        <div 
          v-if="editingSlide !== null" 
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          @click.self="editingSlide = null"
        >
          <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md">
            <div class="p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-slate-800 dark:text-white">
                  Editar Slide {{ (editingSlide || 0) + 1 }}
                </h3>
                <button
                  class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  @click="editingSlide = null"
                >
                  <Icon name="close" :size="18" class="text-slate-400" />
                </button>
              </div>

              <div v-if="editingSlideData" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título</label>
                  <input
                    v-model="editingSlideData.title"
                    type="text"
                    class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Conteúdo</label>
                  <textarea
                    v-model="editingSlideData.content"
                    rows="3"
                    class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm resize-none"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prompt da imagem</label>
                  <textarea
                    v-model="editingSlideData.imagePrompt"
                    rows="3"
                    class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm resize-none"
                  />
                </div>
                <div class="flex gap-2 pt-2">
                  <button
                    class="flex-1 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-medium"
                    @click="editingSlide = null"
                  >
                    Cancelar
                  </button>
                  <button
                    class="flex-1 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm font-medium"
                    @click="saveSlideEdit"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div 
          v-if="toast.show"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-slate-800 dark:bg-slate-700 text-white rounded-xl shadow-xl flex items-center gap-2"
        >
          <Icon :name="toast.icon" :size="18" class="text-green-400" />
          <span class="text-sm font-medium">{{ toast.message }}</span>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { CarouselTone, SocialNetwork } from '~/composables/useCarousel'

useHead({
  title: 'Criador de Carrosséis - EditorIA',
})

const carousel = useCarousel()

// Computed properties para facilitar acesso reativo
const currentCarousel = computed(() => carousel.currentCarousel.value)
const carouselIsLoading = computed(() => carousel.isLoading.value)
const carouselIsGeneratingImages = computed(() => carousel.isGeneratingImages.value)
const carouselProgress = computed(() => carousel.generationProgress.value)

// Computed para verificar estados (resolve problema de SSR)
const hasCarousel = computed(() => {
  const cc = currentCarousel.value
  return cc !== null && 
         cc !== undefined &&
         typeof cc === 'object' &&
         'slides' in cc
})

const isLoading = computed(() => carouselIsLoading.value === true)

// Estado do formulário
const form = reactive({
  topic: '',
  socialNetwork: 'instagram' as SocialNetwork,
  numberOfSlides: 5,
  tone: 'professional' as CarouselTone,
  inspirationImages: [] as { file: File; preview: string; base64?: string }[]
})

// Estado de edição
const editingSlide = ref<number | null>(null)
const editingSlideData = ref<{ title: string; content: string; imagePrompt: string } | null>(null)
const newHashtag = ref('')
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

// Toast
const toast = reactive({
  show: false,
  message: '',
  icon: 'check_circle'
})

// Opções
const tones = [
  { value: 'professional', label: 'Profissional' },
  { value: 'casual', label: 'Casual' },
  { value: 'educational', label: 'Educativo' },
  { value: 'inspirational', label: 'Inspirador' }
] as const

const exampleTopics = [
  '5 dicas de produtividade',
  'Como começar a investir',
  'Marketing digital'
]

// Funções de upload
const triggerFileInput = () => fileInputRef.value?.click()

const handleFileSelect = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files) {
    await processFiles(Array.from(input.files))
    input.value = ''
  }
}

const handleDrop = async (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files) {
    await processFiles(Array.from(e.dataTransfer.files))
  }
}

const processFiles = async (files: File[]) => {
  const maxImages = 5
  const maxSize = 5 * 1024 * 1024
  
  for (const file of files) {
    if (form.inspirationImages.length >= maxImages) break
    if (!file.type.startsWith('image/') || file.size > maxSize) continue
    
    const preview = URL.createObjectURL(file)
    const base64 = await fileToBase64(file)
    form.inspirationImages.push({ file, preview, base64 })
  }
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const removeInspirationImage = (index: number) => {
  URL.revokeObjectURL(form.inspirationImages[index].preview)
  form.inspirationImages.splice(index, 1)
}

// Handlers
const handleGenerate = async () => {
  try {
    const inspirationImages = form.inspirationImages.map(img => ({
      base64: img.base64,
      mimeType: img.file.type
    }))
    
    await carousel.generateCarouselContent({
      topic: form.topic,
      socialNetwork: form.socialNetwork,
      numberOfSlides: form.numberOfSlides,
      tone: form.tone,
      inspirationImages
    })
    showToast('Carrossel gerado com sucesso!', 'check_circle')
  } catch (err: any) {
    showToast(err.message || 'Erro ao gerar carrossel', 'error')
  }
}

const handleGenerateAllImages = async () => {
  try {
    await carousel.generateAllImages({ sequential: true })
    showToast('Imagens geradas!', 'check_circle')
  } catch (err: any) {
    showToast(err.message || 'Erro ao gerar imagens', 'error')
  }
}

const handleRegenerateImage = async (index: number) => {
  try {
    await carousel.regenerateSlideImage(index)
    showToast('Imagem regenerada!', 'check_circle')
  } catch (err: any) {
    showToast(err.message || 'Erro', 'error')
  }
}

const openSlideEditor = (index: number) => {
  const slides = carousel.currentCarousel.value?.slides
  if (slides && slides[index]) {
    editingSlide.value = index
    editingSlideData.value = {
      title: slides[index].title,
      content: slides[index].content,
      imagePrompt: slides[index].imagePrompt
    }
  }
}

const saveSlideEdit = () => {
  if (editingSlide.value !== null && editingSlideData.value) {
    carousel.updateSlide(editingSlide.value, editingSlideData.value)
    editingSlide.value = null
    editingSlideData.value = null
    showToast('Slide atualizado!', 'check_circle')
  }
}

const updateCaption = (e: Event) => {
  carousel.updateCaption((e.target as HTMLTextAreaElement).value)
}

const addHashtag = () => {
  if (newHashtag.value.trim() && carousel.currentCarousel.value) {
    const hashtag = newHashtag.value.replace(/^#/, '').trim()
    if (hashtag && !carousel.currentCarousel.value.hashtags.includes(hashtag)) {
      carousel.updateHashtags([...carousel.currentCarousel.value.hashtags, hashtag])
      newHashtag.value = ''
    }
  }
}

const removeHashtag = (index: number) => {
  if (carousel.currentCarousel.value) {
    const newHashtags = [...carousel.currentCarousel.value.hashtags]
    newHashtags.splice(index, 1)
    carousel.updateHashtags(newHashtags)
  }
}

const copyCaption = async () => {
  if (carousel.currentCarousel.value) {
    await navigator.clipboard.writeText(carousel.currentCarousel.value.caption)
    showToast('Copiado!', 'check_circle')
  }
}

const copyHashtags = async () => {
  if (carousel.currentCarousel.value) {
    await navigator.clipboard.writeText(carousel.currentCarousel.value.hashtags.map(h => `#${h}`).join(' '))
    showToast('Copiado!', 'check_circle')
  }
}

const copyAll = async () => {
  if (carousel.currentCarousel.value) {
    await carousel.copyCaptionToClipboard()
    showToast('Copiado!', 'check_circle')
  }
}

const downloadAllSlides = () => {
  carousel.currentCarousel.value?.slides.forEach((slide, index) => {
    if (slide.image) {
      const link = document.createElement('a')
      link.href = slide.image
      link.download = `slide-${index + 1}.png`
      link.click()
    }
  })
  showToast('Downloads iniciados!', 'download')
}

const startNew = () => {
  carousel.clearCarousel()
  form.topic = ''
  form.inspirationImages = []
}

const showToast = (message: string, icon: string) => {
  toast.message = message
  toast.icon = icon
  toast.show = true
  setTimeout(() => { toast.show = false }, 3000)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

input[type="range"] { -webkit-appearance: none; }
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px; height: 16px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 50%;
  cursor: pointer;
}
</style>
