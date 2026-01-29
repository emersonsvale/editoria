<template>
  <div class="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-[#0d121b] dark:text-white transition-colors duration-200">
    <!-- Sidebar Navigation -->
    <aside class="w-64 border-r border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-[#161e2e] flex flex-col">
      <div class="p-6 flex flex-col gap-1">
        <h1 class="text-xl font-bold tracking-tight text-primary">Media Manager</h1>
        <p class="text-xs text-[#4c669a] dark:text-gray-400 font-medium uppercase tracking-widest">Workspace</p>
      </div>
      <nav class="flex-1 px-4 space-y-1">
        <a class="flex items-center gap-3 px-3 py-2 rounded-lg active-nav group" href="#">
          <Icon name="grid_view" />
          <span class="text-sm font-semibold">All Files</span>
        </a>
        <a class="flex items-center gap-3 px-3 py-2 rounded-lg text-[#4c669a] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#">
          <Icon name="brand_family" />
          <span class="text-sm font-semibold">Logos</span>
        </a>
        <a class="flex items-center gap-3 px-3 py-2 rounded-lg text-[#4c669a] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#">
          <Icon name="image" />
          <span class="text-sm font-semibold">Images</span>
        </a>
        <a class="flex items-center gap-3 px-3 py-2 rounded-lg text-[#4c669a] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#">
          <Icon name="category" />
          <span class="text-sm font-semibold">Icons</span>
        </a>
        <NuxtLink to="/brand-kit" class="flex items-center gap-3 px-3 py-2 rounded-lg text-[#4c669a] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Icon name="auto_awesome" />
          <span class="text-sm font-semibold">Brand Kit</span>
        </NuxtLink>
      </nav>
      <div class="p-4 border-t border-[#cfd7e7] dark:border-gray-700">
        <div class="flex items-center gap-3 px-2">
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">JD</div>
          <div class="flex-1 overflow-hidden">
            <p class="text-sm font-bold truncate">Jane Doe</p>
            <p class="text-[10px] text-[#4c669a] truncate">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top Navigation Bar -->
      <header class="h-16 border-b border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-[#161e2e] flex items-center justify-between px-6 shrink-0">
        <div class="flex items-center gap-4 flex-1 max-w-xl">
          <div class="relative w-full">
            <Icon name="search" />
            <input class="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary transition-all" placeholder="Search your assets..." type="text" />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button class="p-2 text-[#4c669a] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Icon name="notifications" />
          </button>
          <button class="p-2 text-[#4c669a] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Icon name="settings" />
          </button>
          <button class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
            <Icon name="upload" />
            <span>Upload New</span>
          </button>
        </div>
      </header>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-8">
        <!-- Upload Zone -->
        <section>
          <div class="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-primary/30 dark:border-primary/20 bg-white dark:bg-[#161e2e] hover:border-primary hover:bg-blue-50/30 transition-all px-6 py-10 cursor-pointer">
            <div class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Icon name="cloud_upload" size="3xl" />
            </div>
            <div class="text-center">
              <h3 class="text-lg font-bold tracking-tight">Drag & Drop your media here</h3>
              <p class="text-sm text-[#4c669a] dark:text-gray-400">Upload logos, icons, and brand images for your projects</p>
            </div>
            <button class="px-6 py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg hover:bg-primary hover:text-white transition-all">
              Browse Files
            </button>
          </div>
        </section>

        <!-- Asset Tabs -->
        <section class="space-y-4">
          <div class="flex items-center justify-between border-b border-[#cfd7e7] dark:border-gray-700">
            <div class="flex gap-8">
              <a class="pb-3 border-b-2 border-primary text-primary text-sm font-bold" href="#">Recent</a>
              <a class="pb-3 border-b-2 border-transparent text-[#4c669a] hover:text-[#0d121b] dark:hover:text-white text-sm font-bold" href="#">Favorites</a>
              <a class="pb-3 border-b-2 border-transparent text-[#4c669a] hover:text-[#0d121b] dark:hover:text-white text-sm font-bold" href="#">Trash</a>
            </div>
            <div class="flex gap-2 pb-2">
              <button class="p-1 text-[#4c669a] hover:text-primary transition-colors">
                <Icon name="grid_on" />
              </button>
              <button class="p-1 text-[#4c669a] hover:text-primary transition-colors">
                <Icon name="list" />
              </button>
            </div>
          </div>

          <!-- Asset Grid -->
          <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
            <div v-for="(asset, index) in assets" :key="index" class="group relative bg-white dark:bg-[#161e2e] p-3 rounded-xl border border-transparent hover:border-primary/30 hover:shadow-xl transition-all cursor-pointer" :class="{ 'border-primary/50 shadow-md ring-2 ring-primary/20': asset.selected }">
              <div class="w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 overflow-hidden relative">
                <div class="w-full h-full bg-cover bg-center" :style="`background-image: url('${asset.image}')`"></div>
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity px-4 text-center">
                  <button class="w-full py-2 bg-primary text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1">
                    <Icon name="auto_fix_high" size="14px" /> Remove BG
                  </button>
                  <button class="w-full py-2 bg-white/20 hover:bg-white/40 text-white text-[10px] font-bold rounded-lg backdrop-blur-md flex items-center justify-center gap-1">
                    <Icon name="add_circle" size="14px" /> Brand Kit
                  </button>
                </div>
              </div>
              <div class="px-1">
                <p class="text-sm font-bold truncate">{{ asset.name }}</p>
                <p class="text-[10px] text-[#4c669a] font-medium">{{ asset.dimensions }} • {{ asset.size }}</p>
              </div>
              <div v-if="asset.selected" class="absolute top-2 right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
                <Icon name="check" size="14px" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Right Detail Sidebar -->
    <aside class="w-80 border-l border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-[#161e2e] flex flex-col overflow-y-auto">
      <div class="p-6 border-b border-[#cfd7e7] dark:border-gray-700 flex justify-between items-center">
        <h2 class="font-bold">Asset Details</h2>
        <button class="text-[#4c669a] hover:text-[#0d121b] dark:hover:text-white transition-colors">
          <Icon name="close" />
        </button>
      </div>
      <div class="p-6 space-y-8">
        <!-- Selected Preview -->
        <div class="space-y-4">
          <div class="w-full aspect-video bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden border border-[#cfd7e7] dark:border-gray-700">
            <div class="w-full h-full bg-contain bg-center bg-no-repeat" :style="`background-image: url('${selectedAsset.image}')`"></div>
          </div>
          <div>
            <h3 class="font-bold text-lg truncate">{{ selectedAsset.name }}</h3>
            <p class="text-xs text-[#4c669a] font-medium">Uploaded on {{ selectedAsset.date }}</p>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div class="p-3 bg-background-light dark:bg-gray-800 rounded-lg">
            <p class="text-[10px] text-[#4c669a] font-bold uppercase">Dimensions</p>
            <p class="text-sm font-medium">{{ selectedAsset.dimensions }}</p>
          </div>
          <div class="p-3 bg-background-light dark:bg-gray-800 rounded-lg">
            <p class="text-[10px] text-[#4c669a] font-bold uppercase">Format</p>
            <p class="text-sm font-medium">{{ selectedAsset.format }}</p>
          </div>
          <div class="p-3 bg-background-light dark:bg-gray-800 rounded-lg">
            <p class="text-[10px] text-[#4c669a] font-bold uppercase">Size</p>
            <p class="text-sm font-medium">{{ selectedAsset.size }}</p>
          </div>
          <div class="p-3 bg-background-light dark:bg-gray-800 rounded-lg">
            <p class="text-[10px] text-[#4c669a] font-bold uppercase">Folder</p>
            <p class="text-sm font-medium">{{ selectedAsset.folder }}</p>
          </div>
        </div>

        <!-- AI Tags -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon name="smart_toy" />
            <h4 class="text-sm font-bold">AI Visual Tags</h4>
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in selectedAsset.tags" :key="tag" class="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full">{{ tag }}</span>
          </div>
        </div>

        <!-- Main Actions -->
        <div class="space-y-3 pt-4 border-t border-[#cfd7e7] dark:border-gray-700">
          <button class="w-full py-2.5 bg-primary text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
            <Icon name="auto_fix_high" />
            Remove Background
          </button>
          <button class="w-full py-2.5 bg-white dark:bg-gray-800 border border-[#cfd7e7] dark:border-gray-700 text-sm font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Icon name="add_circle" />
            Add to Brand Kit
          </button>
          <div class="flex gap-2">
            <button class="flex-1 py-2 bg-gray-100 dark:bg-gray-800 text-[#4c669a] text-xs font-bold rounded-lg flex items-center justify-center gap-1">
              <Icon name="download" size="16px" /> Download
            </button>
            <button class="flex-1 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 text-xs font-bold rounded-lg flex items-center justify-center gap-1">
              <Icon name="delete" size="16px" /> Delete
            </button>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Media Assets Manager',
})

const assets = ref([
  {
    name: 'Hero Image.jpg',
    dimensions: '1920x1080',
    size: '1.2 MB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ1-2C2wgx9i2FvAPkIL3Fxcdah36Oi2kuqIC69U5aDf5ufyjmmLsU47265gcnnCIrOg3lDqpneBg4vh28XaowjvgK2ZEnzh1RTmHSD1qruHwRRT97j8Hg3QMnkhKzuLyRxq7w2wQGvIPCegJu7YKonkQLlTCaHt5FXNI5iUhsmiJwvgGqb3HrXtgdv7AaaJ45qYjOBlbzhZIgjt6K_o79tIQn2WRbNPa-_1WlIa4zwqAgk3uxnGFzUQAzhpEwt-LM8ZW4nZKSKhM',
    selected: false,
  },
  {
    name: 'Corporate Logo.png',
    dimensions: '512x512',
    size: '45 KB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuJxtLTtwAcRn5lAvLItJ7ZPRoWtJ5CpBgofbK3EL-pttjdJxTQyoL_pXuJXlnOtqWQ07zuA1MApE90M1SiJ7XSq0Oz-4OYEhjZrJSjp9u1S8ZS5aYH-HZldChkA9UOYOaUVhNdwhsA9mhWCzu-orfULhl4-PCjalm1LU61ssLQjwwZ0tnblNwW4QJAXHCmyi1JHAuMVfenYAOd62QLMjyOhcouD0z_c2NoNIX5fhTpdo2E-D92kn_KsMm6_G-yK96Iy3C8qAuags',
    selected: true,
  },
  {
    name: 'Marketing Banner.png',
    dimensions: '1200x630',
    size: '2.4 MB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM6aH75bo6B9HGuqDtKJ_BV_Yg1vPPG8sR-miTFkjRnMawENYqPYEtzw0UC-iuRaoxTslZ7Y2OtMrp_PsNYavxA2bPLRMbV3jhGRhcCM5BtqdBG5oMsX8EP_qdE8hvtxn0I-EQqYX7Ns9ybjfLXjJFb4W8cSBzDxCaM-Fx6b3rdPfqy5Y8v6gBBpaALT0piDHkHXdgUHfzYs_g56_uVME_v8s1Kf1Gs9c92VggDexv2O37UEPlV5hU_s9L1scpZ_H71hkYGyuGToU',
    selected: false,
  },
  {
    name: 'Office Photo.jpg',
    dimensions: '4500x3000',
    size: '5.1 MB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdGaU7Br9n_U9Eg28wRDbQ9G0r5T4c-iyipm7enujwwrnZW0Ser_78JyChGASexqKUdO2IWA5vG9Ow4DxB134pSRGrcdjwmc_hrtA7CHSwMcelfzmrDdFaPB2lKOkPkAJVc8ZzT0moIgxG5n-9w69SYkVCpuW4PDGTPo0NNEpiyuLmr2WyFhjAyrtj3VYsPL_eAcYR8HOoeoIyoYZNXO2QMDdo-0canMLIXkCsUxyDs-PsTrQXRfsU8XrlnQ6auMC1dliiG9hj_HQ',
    selected: false,
  },
  {
    name: 'Pattern Dark.svg',
    dimensions: 'Scalable',
    size: '12 KB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIeaI-psaLXnOSIMI5wiirMG8n9iaTiFfLR9Q_uf1P1OzIT4ZxFUQTkDdwSyD98-vORnR1ynewtPvdfm1JJw-XGMecD5U5kN2J_M9uFhFpjEd-95Kl993jLwAyCz5zyN7jld92Dkyw1YXSCuERhogRBgj0pQx58-joX5VpomUAm860ZNHOiU4YtbkvZnZWo5oUaMbhkOek9_cXTOTAyJxwmRWQxjSMDbNwdxaLJtd-qtciQYyEtAMBJ9nYpIoWGilkREJnkU0nkKk',
    selected: false,
  },
])

const selectedAsset = computed(() => {
  return assets.value.find(a => a.selected) || {
    name: 'Corporate Logo.png',
    dimensions: '512 x 512',
    size: '45.2 KB',
    format: 'PNG Image',
    folder: 'Logos',
    date: 'Oct 12, 2023',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvPoBjr4-VWGhJ-1OZsJZ3lzRsqcHn2o09kY7xv_wuFaGW9Vfknx65ZLS-agDhQ-f03_ndRBxOSmareagb0oCb7z-TZVRsRx_GB9Vuhp8TumwuYnFqtkBJFRXlk6mnPPETVuWN_HpnhPRApl4ZIpxB1hK3s3B0Y0QlDNWGo4k0b77bPDh3G8Rd4wcBi5hpiK0OWaGI1RQjPiFr_4koxA5zOghFhykCPWEpu5489CK1uVb01guzW2-l2w_D6e19AksmzSuVsg8GYw8',
    tags: ['Blue', 'Minimalist', 'Logo', 'Vector Style', 'Iconography'],
  }
})
</script>

