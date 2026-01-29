<template>
  <div class="bg-background-light dark:bg-background-dark min-h-screen text-[#0d121c] dark:text-[#f8f9fc] font-display">
    <!-- Top Navigation Bar -->
    <header class="sticky top-0 z-50 bg-white dark:bg-[#1a2133] border-b border-[#e7ebf4] dark:border-[#2a3447] px-6 lg:px-10 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4 text-primary">
        <div class="size-6">
          <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
          </svg>
        </div>
        <h2 class="text-[#0d121c] dark:text-white text-lg font-bold leading-tight tracking-tight">EditorIA</h2>
      </div>
      <div class="flex items-center gap-6">
        <nav class="hidden md:flex items-center gap-8">
          <NuxtLink to="/" class="text-[#0d121c] dark:text-[#ced7e8] text-sm font-medium hover:text-primary transition-colors">Projects</NuxtLink>
          <a class="text-[#0d121c] dark:text-[#ced7e8] text-sm font-medium hover:text-primary transition-colors" href="#">Templates</a>
          <a class="text-[#0d121c] dark:text-[#ced7e8] text-sm font-medium hover:text-primary transition-colors" href="#">History</a>
        </nav>
        <div class="h-8 w-[1px] bg-[#e7ebf4] dark:bg-[#2a3447] hidden md:block"></div>
        <div class="flex items-center gap-3">
          <button class="p-2 text-[#49659c] hover:bg-[#e7ebf4] dark:hover:bg-[#2a3447] rounded-lg">
            <Icon name="notifications" />
          </button>
          <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border-2 border-primary/20" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCssBr8IlUClzIb994V5k1D0E2nY0pfdL3PcGXecnemYNrY8xv58k671IvuNnW8AYKYRNpygMrBNSFEsQmyVvDdh_ErAhet6FBRv0GsdAfn2_ZtHu0QwBFoXutbKRc4zLFSHhsLa8948iUGu3O9QBZSQWsiHvHZs5lfMjFv0JLtrEkuhni59zwJDL0opYVbXeTTdoFYn32qPTC-6kmvmI2Y46OGRjW6wh78j2FdlshN1jn23vGakkUMlK-ln1wBNu9S_c-h6ftBUpo");'></div>
        </div>
      </div>
    </header>

    <main class="max-w-[1440px] mx-auto flex flex-col min-h-[calc(100vh-64px)]">
      <!-- Preparation Progress Bar -->
      <div class="px-6 lg:px-10 pt-6 pb-2">
        <div class="flex flex-col gap-2 bg-white dark:bg-[#1a2133] p-4 rounded-xl border border-[#e7ebf4] dark:border-[#2a3447] shadow-sm">
          <div class="flex gap-6 justify-between items-center">
            <div class="flex items-center gap-2">
              <Icon name="refresh" />
              <p class="text-[#0d121c] dark:text-white text-sm font-semibold">Preparing your high-resolution assets...</p>
            </div>
            <p class="text-primary text-sm font-bold">{{ progress }}%</p>
          </div>
          <div class="h-2 rounded-full bg-[#ced7e8] dark:bg-[#2a3447] overflow-hidden">
            <div class="h-full bg-primary transition-all duration-300" :style="`width: ${progress}%`"></div>
          </div>
          <p class="text-[#49659c] dark:text-[#8899b8] text-xs font-medium italic">Magic Resize is optimizing layers for export</p>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row flex-1 p-6 lg:px-10 gap-8">
        <!-- Left Side: Asset Grid -->
        <div class="flex-1 space-y-6">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex flex-col gap-1">
              <h1 class="text-[#0d121c] dark:text-white text-3xl font-black tracking-tight">Batch Export</h1>
              <p class="text-[#49659c] dark:text-[#8899b8] text-sm">Review and customize {{ exportAssets.length }} generated variants.</p>
            </div>
            <div class="flex gap-2">
              <button class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a2133] border border-[#ced7e8] dark:border-[#2a3447] text-[#0d121c] dark:text-white text-sm font-bold rounded-lg hover:bg-[#f8f9fc] dark:hover:bg-[#2a3447] transition-all">
                <Icon name="check_circle" />
                Select All
              </button>
              <button class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a2133] border border-[#ced7e8] dark:border-[#2a3447] text-[#0d121c] dark:text-white text-sm font-bold rounded-lg hover:bg-[#f8f9fc] dark:hover:bg-[#2a3447] transition-all">
                <Icon name="filter_list" />
                Filter
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="(asset, index) in exportAssets" :key="index" class="group relative flex flex-col bg-white dark:bg-[#1a2133] rounded-xl border border-[#e7ebf4] dark:border-[#2a3447] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div class="absolute top-3 left-3 z-10">
                <input v-model="asset.selected" class="w-5 h-5 rounded text-primary focus:ring-primary border-[#ced7e8] dark:border-[#2a3447]" type="checkbox" />
              </div>
              <div class="w-full bg-[#f8f9fc] dark:bg-[#101622] aspect-[4/5] relative overflow-hidden flex items-center justify-center p-4">
                <div class="w-full h-full bg-center bg-no-repeat bg-cover rounded shadow-lg transform transition-transform group-hover:scale-105" :style="`background-image: url('${asset.image}')`"></div>
                <div v-if="asset.type === 'video'" class="absolute inset-0 flex items-center justify-center">
                  <Icon name="play_circle" />
                </div>
              </div>
              <div class="p-4 space-y-3">
                <div>
                  <h3 class="text-[#0d121c] dark:text-white text-base font-bold">{{ asset.name }}</h3>
                  <p class="text-[#49659c] dark:text-[#8899b8] text-xs font-medium uppercase tracking-wider">{{ asset.dimensions }} PX</p>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[#49659c] dark:text-[#8899b8] text-xs font-bold">FORMAT</label>
                  <select v-model="asset.format" class="w-full h-10 rounded-lg border-[#ced7e8] dark:border-[#2a3447] bg-white dark:bg-[#101622] text-[#0d121c] dark:text-white text-sm focus:ring-primary focus:border-primary">
                    <option v-for="fmt in asset.formats" :key="fmt" :value="fmt">{{ fmt }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Export Summary Panel -->
        <aside class="w-full lg:w-[380px] space-y-6">
          <div class="sticky top-24 space-y-6">
            <div class="bg-white dark:bg-[#1a2133] rounded-2xl border border-[#e7ebf4] dark:border-[#2a3447] p-6 shadow-lg">
              <h2 class="text-xl font-black text-[#0d121c] dark:text-white mb-6">Export Summary</h2>
              <div class="space-y-4 mb-8">
                <div class="flex justify-between items-center py-2 border-b border-[#f0f2f7] dark:border-[#2a3447]">
                  <span class="text-[#49659c] dark:text-[#8899b8] text-sm font-medium">Selected Assets</span>
                  <span class="text-[#0d121c] dark:text-white text-sm font-bold">{{ selectedCount }} Files</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-[#f0f2f7] dark:border-[#2a3447]">
                  <span class="text-[#49659c] dark:text-[#8899b8] text-sm font-medium">Estimated Size</span>
                  <span class="text-[#0d121c] dark:text-white text-sm font-bold">~ {{ estimatedSize }} MB</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-[#49659c] dark:text-[#8899b8] text-sm font-medium">Export Profile</span>
                  <span class="text-primary text-sm font-bold">Social Ready</span>
                </div>
              </div>

              <!-- Quality Slider -->
              <div class="space-y-4 mb-8">
                <div class="flex justify-between items-center">
                  <label class="text-[#0d121c] dark:text-white text-sm font-black uppercase tracking-wide">Image Quality</label>
                  <span class="text-primary text-sm font-bold">{{ quality }}%</span>
                </div>
                <input v-model.number="quality" class="w-full h-2 bg-[#ced7e8] dark:bg-[#2a3447] rounded-lg appearance-none cursor-pointer accent-primary" type="range" min="50" max="100" />
                <div class="flex justify-between text-[10px] text-[#49659c] dark:text-[#8899b8] font-bold">
                  <span>FASTER</span>
                  <span>BALANCED</span>
                  <span>BEST QUALITY</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="space-y-3">
                <button class="w-full flex items-center justify-center gap-3 bg-primary hover:bg-[#0b4ed4] text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/25">
                  <Icon name="download" />
                  Download All (.zip)
                </button>
                <button class="w-full flex items-center justify-center gap-3 bg-[#e7ebf4] dark:bg-[#2a3447] hover:bg-[#ced7e8] dark:hover:bg-[#344158] text-[#0d121c] dark:text-white py-4 rounded-xl font-bold transition-all">
                  <Icon name="share" />
                  Share to Social Media
                </button>
              </div>

              <div class="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div class="flex gap-3">
                  <Icon name="info" />
                  <p class="text-xs text-[#49659c] dark:text-[#8899b8] leading-relaxed">
                    Files are optimized for fast loading while maintaining professional clarity.
                  </p>
                </div>
              </div>
            </div>

            <!-- Secondary Quick Settings -->
            <div class="bg-white dark:bg-[#1a2133] rounded-2xl border border-[#e7ebf4] dark:border-[#2a3447] p-6">
              <h3 class="text-sm font-black text-[#0d121c] dark:text-white mb-4 flex items-center gap-2">
                <Icon name="settings" />
                Advanced Settings
              </h3>
              <div class="space-y-3">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input v-model="settings.transparentBg" class="w-5 h-5 rounded text-primary focus:ring-primary border-[#ced7e8] dark:border-[#2a3447]" type="checkbox" />
                  <span class="text-sm text-[#49659c] dark:text-[#8899b8] group-hover:text-[#0d121c] dark:group-hover:text-white transition-colors">Transparent background (PNG)</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input v-model="settings.removeMetadata" class="w-5 h-5 rounded text-primary focus:ring-primary border-[#ced7e8] dark:border-[#2a3447]" type="checkbox" />
                  <span class="text-sm text-[#49659c] dark:text-[#8899b8] group-hover:text-[#0d121c] dark:group-hover:text-white transition-colors">Remove metadata</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input v-model="settings.includeSource" class="w-5 h-5 rounded text-primary focus:ring-primary border-[#ced7e8] dark:border-[#2a3447]" type="checkbox" />
                  <span class="text-sm text-[#49659c] dark:text-[#8899b8] group-hover:text-[#0d121c] dark:group-hover:text-white transition-colors">Include source project (.studio)</span>
                </label>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <!-- Simple Footer -->
    <footer class="mt-auto px-6 lg:px-10 py-8 border-t border-[#e7ebf4] dark:border-[#2a3447]">
      <div class="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-[#49659c] dark:text-[#8899b8] text-sm">© 2024 EditorIA. All rights reserved.</p>
        <div class="flex gap-6">
          <a class="text-xs font-bold text-[#49659c] hover:text-primary transition-colors" href="#">Support</a>
          <a class="text-xs font-bold text-[#49659c] hover:text-primary transition-colors" href="#">Documentation</a>
          <a class="text-xs font-bold text-[#49659c] hover:text-primary transition-colors" href="#">License</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Batch Export and Download',
})

const progress = ref(85)
const quality = ref(90)

const exportAssets = ref([
  {
    name: 'Instagram Story',
    dimensions: '1080 x 1920',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBN_7bf7Aa5JsBY99aaurnucfWTH6z5GXT4VES-0VQAT_KzgNyhj1_z3KE7_8rn24OYbMqvQqKfVy7d1kUMyyjQdK3zbzKhG9vlQbjv1ilxoq0oe-FtoFjdiN7yVgmgxoDJQHqZlmS9OpCH84nJy_Ke1p5IquVONXfF5i9pGgYMll4XM5AcjLjq3T2u8ZkfZtN7-lv9CzyV7dCMqLW4WuXjw1LsPJQJA_dAAh5BRtFzev0mV8JFZL2FTMN5NzgKS7cmR78Cubf3hyA',
    selected: true,
    format: 'PNG (Lossless)',
    formats: ['JPG (High Quality)', 'PNG (Lossless)', 'PDF (Print)', 'MP4 (Animated)'],
    type: 'image',
  },
  {
    name: 'LinkedIn Post',
    dimensions: '1200 x 627',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsS7UeeCAuY_b5_bTZY-ROhSJwq63rKvC2t3xsCTeyK6rCoimIbm84WOluVWIe4d6fXNA_7ob-uR8k509BkheFaJX9LVnlpyjwTdQiMREQeZ3H8GUXrhlL3hhZR56wT5fDVtuZx36iJqMZWm8Yg634SfVFrvSeTBp7Jx2-oghuGcchqwIa0RaxcGNB39fkJwG9PngDJgXldquCBQQmPi3AmnAHFvvbnG02I6tjGVBHH9DpFM-wY3GX0hbbMBRqByEo8UXX7nVVun0',
    selected: true,
    format: 'JPG (High Quality)',
    formats: ['JPG (High Quality)', 'PNG (Lossless)', 'PDF (Print)'],
    type: 'image',
  },
  {
    name: 'TikTok Video',
    dimensions: '1080 x 1920',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCsPd0Q7Ek_uQ4PDOrf8a2Bs4CaY4iVG0pBBLXDSv91-K2XQ50PQz7iGruT8VU1VgMOGEP0ceoQuu7AW1JzrqCggoro05ZD3g9rAGmW4_dY-hc0Vd7ypXyM1M8x3LeB-XS7FtXE9OVbr_MHSQ-ia-w9nwr5_afQA7paIMJXpOB3VKirOYHv9YPpr_eWc3BBoFlhtTNy3w8F7LmAwVYXrQrXfIwu2py9kY4AE2EjfDznFiDdt9bfcCTwzz6pyxk7Xw70xMwvIlmYkw',
    selected: true,
    format: 'MP4 (1080p)',
    formats: ['MP4 (1080p)', 'GIF'],
    type: 'video',
  },
  {
    name: 'Facebook Header',
    dimensions: '820 x 312',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAerkwNkh9rFh7mJJgaBasPzPnLkI-mYTkz8LIHYkyofEW-xl6EINqQ9HtrtekuJ7LI9hXmxVz6wDXektk9Hn5IVCZiK6jGOqJn_3zL9mQC9bZqR0Gz8UN67T-lluIZgzQwGitghteVAsjrFZFF33-f2GkKLcHL4RQ1-M4HA8uS-ZUZToM3IU-xYAIu9pe8meN0knKURr5Gq_32syi8l6uITY3NN-EyIshY1451z9V9loYc0RBHqM09Gm7gFgqpUyjZB3VqiOj_gaE',
    selected: true,
    format: 'JPG (Standard)',
    formats: ['JPG (Standard)', 'PNG'],
    type: 'image',
  },
])

const settings = ref({
  transparentBg: false,
  removeMetadata: true,
  includeSource: false,
})

const selectedCount = computed(() => exportAssets.value.filter(a => a.selected).length)
const estimatedSize = computed(() => {
  const base = selectedCount.value * 3.5
  return base.toFixed(1)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700;800;900&display=swap');
</style>

