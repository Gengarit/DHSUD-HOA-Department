<template>
  <div class="flex h-screen w-screen font-inter bg-white">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 h-full w-16 bg-[#003366] flex flex-col items-center py-6 shadow-lg z-20">
      <div class="mb-8">
        <img src="/pictures/DHSUDLogo.png" alt="DHSUD" class="w-10 h-10 rounded-full border-2 border-white" />
      </div>
      <nav class="flex-1 flex flex-col gap-6 items-center w-full">
        <router-link to="/" class="sidebar-icon" active-class="sidebar-icon-active">
          <span class="material-icons">dashboard</span>
        </router-link>
        <router-link to="/hoa-registry" class="sidebar-icon" active-class="sidebar-icon-active">
          <span class="material-icons">apartment</span>
        </router-link>
        <router-link to="/nov" class="sidebar-icon" active-class="sidebar-icon-active">
          <span class="material-icons">report</span>
        </router-link>
        <router-link to="/oias" class="sidebar-icon" active-class="sidebar-icon-active">
          <span class="material-icons">assignment</span>
        </router-link>
        <router-link to="/otp" class="sidebar-icon" active-class="sidebar-icon-active">
          <span class="material-icons">verified_user</span>
        </router-link>
        <router-link to="/sanctions" class="sidebar-icon" active-class="sidebar-icon-active">
          <span class="material-icons">gavel</span>
        </router-link>
      </nav>
      <div class="mt-auto mb-2 text-[10px] text-blue-100">© 2026 DHSUD</div>
    </aside>
    <!-- Main Content -->
    <main class="flex-1 ml-16 h-full overflow-y-auto bg-white transition-all">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

html, body, #app {
  height: 100%;
  margin: 0;
  font-family: 'Inter', 'Geist', sans-serif;
  background: #fff;
}

.sidebar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  color: #fff;
  transition: background 0.2s, color 0.2s;
  font-size: 1.7rem;
}
.sidebar-icon:hover, .sidebar-icon-active {
  background: #1e40af;
  color: #fff;
}
.material-icons {
  font-size: 1.7rem;
}

main {
  background: #fff;
  min-height: 100vh;
  padding: 0;
}
</style>
