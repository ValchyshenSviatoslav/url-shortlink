<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <div class="card shadow-sm border-0 bg-light p-4 mb-5">
        <h2 class="text-center mb-4 fw-bold">Реєстрація</h2>
        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <label class="form-label fw-semibold">Ім'я</label>
            <input v-model="name" type="text" class="form-control" required>
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold">Електронна пошта</label>
            <input v-model="email" type="email" class="form-control" required>
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold">Пароль</label>
            <input v-model="password" type="password" class="form-control" required>
          </div>
          <div class="d-grid mt-4">
            <button type="submit" class="btn btn-primary btn-lg">Зареєструватися</button>
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

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

const handleRegister = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })
    localStorage.setItem('user_id', response.data.user_id)
    alert('Реєстрація успішна!')
    router.push('/profile')
  } catch (error) {
    alert(error.response?.data?.detail || 'Помилка при реєстрації')
  }
}
</script>