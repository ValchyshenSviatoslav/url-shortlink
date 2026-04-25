<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <div class="card shadow-sm border-0 bg-light p-4 mb-5">
        <h2 class="text-center mb-4 fw-bold">Вхід до акаунту</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label fw-semibold">Електронна пошта</label>
            <input v-model="email" type="email" class="form-control" required>
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold">Пароль</label>
            <input v-model="password" type="password" class="form-control" required>
          </div>
          <div class="d-grid mt-4">
            <button type="submit" class="btn btn-primary btn-lg">Увійти</button>
          </div>
          <div class="text-center mt-3 text-muted">
            Ще не маєте акаунту? <router-link to="/register" class="fw-bold">Зареєструватися</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/auth/login', {
      email: email.value,
      password: password.value
    })
    localStorage.setItem('user_id', response.data.user_id)
    router.push('/profile')
  } catch (error) {
    alert(error.response?.data?.detail || 'Помилка авторизації')
  }
}
</script>