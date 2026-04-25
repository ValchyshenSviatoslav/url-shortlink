<<template>
  <div class="d-flex flex-column min-vh-100 bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <span class="navbar-brand">🔗 ShortLink 3.0</span>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/login" active-class="active">Вхід</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register" active-class="active">Реєстрація</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/profile" active-class="active">Профіль</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/about" active-class="active">Про додаток</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container mt-5 flex-grow-1">
      <router-view></router-view>
    </main>

    <footer class="bg-dark text-white text-center py-3 mt-auto">
      <div class="container">
        <p class="mb-0">© 2026 Лабораторна робота: ShortLink (Vue + FastAPI)</p>
      </div>
    </footer>
  </div>
</template>

<style>

#app {
  max-width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  text-align: left !important;
}
</style>