<template>
  <div class="card border-0 shadow-sm rounded-4">
    <div class="card-body">
      <ul class="list-group list-group-flush text-start">
        <li
          v-for="card in cards"
          :key="card.id"
          class="list-group-item btn"
          :class="{ active: $route.name === card.id }"
          @click="$emit('select-card', card.id)"
        >
          <i :class="card.icon"></i> {{ card.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cards: [
        {
          id: "CardProfil",
          title: "Profil Setting",
          icon: "bi bi-person-fill-gear",
        },
        {
          id: "CardBooking",
          title: "Reservasi Konsultasi",
          icon: "bi bi-journal-bookmark-fill",
        },
        {
          id: "CardHistory",
          title: "Riwayat Konsultasi",
          icon: "bi bi-clock-history",
        },
      ],
    };
  },
};
</script>