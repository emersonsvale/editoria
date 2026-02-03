<template>
  <div class="bg-background-light dark:bg-background-dark font-display text-[#0d121b] dark:text-slate-100 min-h-screen">
    <!-- Top Navigation Bar -->
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-solid border-[#e7ebf3] dark:border-slate-800 px-6 lg:px-40 py-3">
      <div class="max-w-[1200px] mx-auto flex items-center justify-between whitespace-nowrap">
        <div class="flex items-center gap-4 text-[#0d121b] dark:text-white">
          <div class="size-6 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 class="text-lg font-bold leading-tight tracking-[-0.015em]">EditorIA</h2>
        </div>
        <div class="flex flex-1 justify-end gap-8 items-center">
          <nav class="hidden md:flex items-center gap-9">
            <NuxtLink to="/" class="text-[#0d121b] dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors">Projects</NuxtLink>
            <a class="text-[#0d121b] dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Templates</a>
            <NuxtLink to="/brand-kit" class="text-primary text-sm font-bold border-b-2 border-primary">Brand Kits</NuxtLink>
            <NuxtLink to="/media-manager" class="text-[#0d121b] dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors">Assets</NuxtLink>
          </nav>
          <div class="flex items-center gap-4">
            <button class="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
              <span>Save Changes</span>
            </button>
            <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white shadow-sm" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDrt89A4KAmbYknPqHLRVvyEq2fbP4Se8a55oXV2BwDBYMjTJkixBgUt4IcpBeE-NNoF5-VNiQoJBciFexr_8SUhlLUFIm-1uMWGgf98ymZfp8nbXzFq5epwjOs6GdYeRW4PT2WTSJVgpXgvtPPYc5A6mc1QvvyxbnIRfk4IvIcOlXWiFgt3DSder8oZIqe2ZPCmcf1BWrxg4edFcunGadsZXbaKYqiEx8ZZo4d66hDiciU2Q1fNO3gA0sZ4_YSOHKs2St-oQkp7gg");'></div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-[1200px] mx-auto px-6 lg:px-40 py-10">
      <!-- Page Heading -->
      <div class="flex flex-wrap justify-between items-end gap-3 mb-12">
        <div class="flex flex-col gap-2">
          <p class="text-[#0d121b] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Acme Corp Brand Kit</p>
          <p class="text-[#4c669a] dark:text-slate-400 text-base font-normal">Manage your visual identity, assets, and brand voice guidelines</p>
        </div>
        <button class="flex items-center gap-2 cursor-pointer rounded-lg h-10 px-4 bg-[#e7ebf3] dark:bg-slate-800 text-[#0d121b] dark:text-slate-200 text-sm font-bold hover:bg-[#d0d6e2] transition-colors">
          <Icon name="edit" />
          <span>Edit Name</span>
        </button>
      </div>

      <!-- Section: Logos -->
      <section class="mb-16">
        <div class="flex items-center justify-between px-4 pb-3 pt-5">
          <h2 class="text-[#0d121b] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Logos</h2>
          <button class="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
            <Icon name="add_circle" />
            Add Variation
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
          <div v-for="(logo, index) in logos" :key="index" class="group flex flex-col gap-3 pb-3">
            <div class="relative w-full aspect-square flex items-center justify-center rounded-xl overflow-hidden transition-all group-hover:shadow-md" :class="logo.bgClass">
              <div class="bg-center bg-no-repeat size-32 bg-contain" :style="`background-image: url('${logo.image}')`"></div>
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                <button class="bg-white p-2 rounded-full text-primary shadow-sm hover:scale-110 transition-transform">
                  <Icon name="upload" />
                </button>
                <button class="bg-white p-2 rounded-full text-red-500 shadow-sm hover:scale-110 transition-transform">
                  <Icon name="delete" />
                </button>
              </div>
            </div>
            <div>
              <p class="text-[#0d121b] dark:text-white text-base font-medium leading-normal">{{ logo.name }}</p>
              <p class="text-[#4c669a] dark:text-slate-400 text-sm font-normal">{{ logo.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Color Palettes -->
      <section class="mb-16">
        <div class="flex items-center justify-between px-4 pb-3 pt-5">
          <h2 class="text-[#0d121b] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Color Palettes</h2>
          <button class="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors">
            <Icon name="palette" />
            Create New Palette
          </button>
        </div>
        <div class="p-4 space-y-8">
          <div class="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-[#e7ebf3] dark:border-slate-800">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-bold">Core Brand Palette</h3>
              <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">DEFAULT</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              <div v-for="(color, index) in colors" :key="index" class="space-y-2">
                <div class="h-20 w-full rounded-lg shadow-inner" :class="color.bg" :style="color.style"></div>
                <p class="text-xs font-bold truncate">{{ color.name }}</p>
                <p class="text-[10px] text-slate-500 font-mono">{{ color.code }}</p>
              </div>
              <div class="flex items-center justify-center h-20 w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg group cursor-pointer hover:border-primary transition-colors">
                <Icon name="add" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Typography -->
      <section class="mb-16">
        <h2 class="text-[#0d121b] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-6 pt-5">Typography</h2>
        <div class="p-4 grid grid-cols-1 gap-6">
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-[#e7ebf3] dark:border-slate-800 flex flex-col md:flex-row md:items-center gap-8">
            <div class="w-full md:w-1/3">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Brand Headings</label>
              <h3 class="text-xl font-bold font-brand-heading">Cormorant Garamond</h3>
              <p class="text-sm text-slate-500">600 SemiBold • Serif</p>
            </div>
            <div class="flex-1 border-l border-slate-100 dark:border-slate-700 md:pl-8">
              <p class="font-brand-heading text-4xl text-[#0d121b] dark:text-white">The quick brown fox jumps over the lazy dog</p>
            </div>
            <button class="text-slate-400 hover:text-primary">
              <Icon name="settings_suggest" />
            </button>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-[#e7ebf3] dark:border-slate-800 flex flex-col md:flex-row md:items-center gap-8">
            <div class="w-full md:w-1/3">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Body Text</label>
              <h3 class="text-xl font-bold font-brand-body">Open Sans</h3>
              <p class="text-sm text-slate-500">400 Regular • Sans Serif</p>
            </div>
            <div class="flex-1 border-l border-slate-100 dark:border-slate-700 md:pl-8">
              <p class="font-brand-body text-base text-[#4c669a] dark:text-slate-300 leading-relaxed">
                Consistent typography is essential for building a recognizable brand. Open Sans provides excellent legibility across digital interfaces, maintaining clarity at small sizes while offering a modern, approachable feel.
              </p>
            </div>
            <button class="text-slate-400 hover:text-primary">
              <Icon name="settings_suggest" />
            </button>
          </div>
        </div>
      </section>

      <!-- Section: Brand Voice -->
      <section class="mb-20">
        <h2 class="text-[#0d121b] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Brand Voice</h2>
        <div class="p-4">
          <div class="bg-white dark:bg-slate-800 p-8 rounded-xl border border-[#e7ebf3] dark:border-slate-800 shadow-sm">
            <div class="flex flex-col gap-4">
              <label class="text-sm font-semibold text-[#0d121b] dark:text-white">Tone & Personality</label>
              <textarea v-model="brandVoice" class="w-full min-h-[160px] p-4 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus:ring-primary focus:border-primary leading-relaxed text-[#4c669a] dark:text-slate-300" placeholder="Describe how your brand speaks to its audience..."></textarea>
              <div class="flex flex-wrap gap-2 mt-2">
                <span v-for="tag in voiceTags" :key="tag" class="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{{ tag }}</span>
                <button class="border border-dashed border-slate-300 dark:border-slate-600 px-3 py-1 rounded-full text-xs text-slate-400 hover:text-primary hover:border-primary transition-colors">+ Add Tag</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 py-10 px-6 lg:px-40">
      <div class="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-2 text-slate-400">
          <Icon name="auto_awesome" />
          <span class="text-sm">Last synced: 2 minutes ago</span>
        </div>
        <div class="flex gap-6 text-sm text-slate-500">
          <a class="hover:text-primary" href="#">Guidelines</a>
          <a class="hover:text-primary" href="#">Asset Export</a>
          <a class="hover:text-primary" href="#">Settings</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'creation', middleware: 'auth-creation' })

useHead({
  title: 'Brand Kit Management | EditorIA',
})

const brandVoice = ref('Our brand voice is \'Professional but Friendly\'. We aim to sound authoritative and knowledgeable in our industry, yet accessible and approachable. We avoid overly dense jargon, preferring clear, benefit-driven communication that respects our users\' time and intelligence. We use active verbs and a supportive tone to empower our community.')

const voiceTags = ref(['Authoritative', 'Friendly', 'Clear'])

const logos = ref([
  {
    name: 'Primary Logo',
    description: 'Main brand mark (SVG/PNG)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCClCD_FgN_6dwwsZr5i_zQKICCG9kvwm7N8Ml_Qoh2pqj4G-AVrNTgj6TEptcKKQVBHKSN2bmKEXsPbJqMbOcyjmPqecWJbs69zzbGO0nhvKt13orLxIksIyHyt7eKb5Qy6Jw54BB00fxUPge9cuEekWjBNJWPToT3Hisq1G9HZzpi1CXvItbo3E9KA3JPko3uNA9ZxsVZEyxcutkGtiEQtTbC8RFeI-9uu8H4iFGXvKuEjIuYCOkjVHR3oqNwtVb2wnYfuCoVrBw',
    bgClass: 'bg-white dark:bg-slate-800 border-2 border-dashed border-[#e7ebf3] dark:border-slate-700 group-hover:border-primary/50',
  },
  {
    name: 'Light Variation',
    description: 'For dark backgrounds',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEs0T9T3Sj1eiDKmC4EUboYFDUD4f71NHgr1q1N0x_H7Hbxu6h7RZC_Uqo6iFef1w92m68Sb3F45JUZIGIilirmyCd20MxAd1949wEmY8EbLRH2-R2xlESOVcatkVDxcX7xb9ekxvZ7MLSjNWM6cuNm5XH1jttvswN_pooE8qVrm4XsMbd3uhqHGADDIiW0DMTHogh3MHTT4bo1RuguLfSVzvDb2v2ptjcPOkxu-QdmDKR2mZQBRt__AaPQdcJQLloNEwAFSzQVGQ',
    bgClass: 'bg-[#101622]',
  },
  {
    name: 'Dark Variation',
    description: 'For light backgrounds',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDV4iDCS2JDCLUDOgnJ84sMfQ4pObLup5UbULWXqjMithg_aSSazpjK6CVNR6o30G-qh0AgBAAnRO33oGnwXXwlsDKjs8aezljsdIBX0EcfoVUuG8uZqz8OYIklKlT5PfZZ_9Dv7ooPOd-3Rcwq_1CvH2BusgYdq18izLR_FSc8z-wx6R3fpCIFrGk6Zdy7eyJH0v0BPx8KUuroC-OMCc7R8KNi5iD4JvTt91Ibo7Qvz_3ZFz8Zrpkz9uZJ7nFJrh8VfcGSZf95yuA',
    bgClass: 'bg-[#f8f9fc] dark:bg-slate-700/30 border border-[#e7ebf3] dark:border-slate-800',
  },
])

const colors = ref([
  { name: 'Primary Blue', code: '#135BEC', bg: 'bg-primary', style: '' },
  { name: 'Deep Dark', code: '#101622', bg: 'bg-[#101622]', style: 'border border-white/10' },
  { name: 'Soft Gray', code: '#F6F6F8', bg: 'bg-[#f6f6f8]', style: 'border border-slate-200' },
  { name: 'Accent Slate', code: '#4C669A', bg: 'bg-[#4c669a]', style: '' },
  { name: 'Coral Spark', code: '#FF7B54', bg: 'bg-[#ff7b54]', style: '' },
])
</script>

