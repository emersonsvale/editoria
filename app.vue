<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700;800;900&display=swap');

.active-nav {
  background-color: rgba(30, 123, 82, 0.15);
  color: #1e7b52;
}

.canvas-dot-grid {
  background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
  background-size: 24px 24px;
}

.dark .canvas-dot-grid {
  background-image: radial-gradient(circle, #334155 1px, transparent 1px);
}

.transparent-grid {
  background-image: 
    linear-gradient(45deg, #e2e8f0 25%, transparent 25%), 
    linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #e2e8f0 75%), 
    linear-gradient(-45deg, transparent 75%, #e2e8f0 75%);
  background-size: 10px 10px;
  background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
}

.dark .transparent-grid {
  background-image: 
    linear-gradient(45deg, #334155 25%, transparent 25%), 
    linear-gradient(-45deg, #334155 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #334155 75%), 
    linear-gradient(-45deg, transparent 75%, #334155 75%);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
}
</style>
