<template>
  <div class="row justify-content-center">
    <div class="col-md-8 col-lg-6">
      <div class="card shadow-sm border-0 bg-light p-5 text-center">
        <h2 class="mb-4 fw-bold text-primary">Про додаток ShortLink</h2>
        <p class="lead mb-4">
          Цей веб-додаток розроблено в рамках лабораторних робіт з дисципліни "Web-дизайн".
        </p>
        <div class="text-start">
          <h5 class="fw-bold">Технологічний стек:</h5>
          <ul class="list-group list-group-flush mb-4">
            <li class="list-group-item bg-transparent"><strong>Frontend:</strong> Vue.js 3, Vite, Axios, Bootstrap 5</li>
            <li class="list-group-item bg-transparent"><strong>Backend:</strong> Python, FastAPI, SQLAlchemy</li>
            <li class="list-group-item bg-transparent"><strong>База даних:</strong> SQLite</li>
          </ul>
          <h5 class="fw-bold">Основні функції:</h5>
          <ul class="mb-0 text-muted">
            <li>Реєстрація та авторизація користувачів.</li>
            <li>Генерація унікальних коротких посилань (хешів).</li>
            <li>Збереження історії посилань у базі даних сервера.</li>
            <li>Фізичний редірект та підрахунок кількості переходів.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>