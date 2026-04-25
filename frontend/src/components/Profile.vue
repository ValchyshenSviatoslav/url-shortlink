<template>
  <div>
    <div class="card shadow-sm border-0 bg-light p-4 mb-5 text-center">
      <h1 class="mb-4 fw-bold text-primary">Створіть коротке посилання</h1>
      <form @submit.prevent="shortenLink" class="d-flex justify-content-center gap-2 mb-4">
        <input v-model="newUrl" type="url" class="form-control w-50" placeholder="Вставте довге посилання сюди..." required>
        <button type="submit" class="btn btn-primary px-4 fw-semibold">Скоротити</button>
      </form>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="fw-bold">Ваші посилання</h3>
      <button @click="logout" class="btn btn-outline-danger btn-sm">Вийти з акаунту</button>
    </div>

    <div class="table-responsive shadow-sm rounded">
      <table class="table table-hover align-middle mb-0 bg-white">
        <thead class="table-dark">
          <tr>
            <th scope="col">Оригінальне посилання</th>
            <th scope="col">Коротке посилання</th>
            <th scope="col">Кліки</th>
            <th scope="col">Дата створення</th>
            <th scope="col">Дія</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="links.length === 0">
            <td colspan="5" class="text-center text-muted py-4">У вас ще немає збережених посилань.</td>
          </tr>
          <tr v-for="link in links" :key="link.id">
            <td class="text-truncate" style="max-width: 250px;">
              <a :href="link.original_url" target="_blank" class="text-muted">{{ link.original_url }}</a>
            </td>
            <td>
              <a :href="link.short_url" target="_blank" class="fw-bold text-primary">{{ link.short_url }}</a>
            </td>
            <td><span class="badge bg-success rounded-pill">{{ link.clicks }}</span></td>
            <td>{{ link.date_created }}</td>
            <td>
              <button @click="deleteLink(link.id)" class="btn btn-sm btn-outline-danger">Видалити</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const newUrl = ref('')
const links = ref([])
const router = useRouter()
const userId = localStorage.getItem('user_id')

onMounted(() => {
  if (!userId) {
    router.push('/login')
    return
  }
  fetchLinks()
})

const fetchLinks = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/links/${userId}`)
    links.value = response.data
  } catch (error) {
    console.error("Помилка завантаження посилань", error)
  }
}

const shortenLink = async () => {
  try {
    await axios.post('http://127.0.0.1:8000/links/', {
      original_url: newUrl.value,
      user_id: parseInt(userId)
    })
    newUrl.value = ''
    fetchLinks()
  } catch (error) {
    alert('Помилка при скороченні посилання')
  }
}

const deleteLink = async (id) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/links/${id}`)
    fetchLinks()
  } catch (error) {
    console.error("Помилка видалення", error)
  }
}

const logout = () => {
  localStorage.removeItem('user_id')
  router.push('/login')
}
</script>