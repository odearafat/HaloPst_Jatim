<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header p-4 d-flex align-items-center">
      <button class="btn btn-outline-dark mb-2" @click="goBack">
        <h5 class="mb-0 bi bi-arrow-left"></h5>
      </button>
      <h4 class="card-title ms-3">Detail History</h4>
    </div>
    <div class="card-body p-4">
      <div v-if="loading" class="text-center">
        <img src="@\assets\loading_2.svg" alt="Loading..." />
        <p>Loading...</p>
      </div>
      <div v-else class="container">
        <div v-if="history.status === 'Selesai'">
          <h5 class="fw-semibold text-success mb-0">
            <i class="bi bi-check2-circle me-2"></i>Konsultasi Telah Selesai
            Dilaksanakan
          </h5>
          <!-- <small class="mb-4 text-muted"
            >Mohon lihat email Anda untuk detail pembatalan.</small
          > -->
        </div>
        <div v-else-if="history.status === 'Dibatalkan'">
          <h5 class="fw-semibold text-danger mb-0">
            <i class="bi bi-x-circle-fill me-2"></i>Reservasi Konsultasi Telah
            di Batalkan
          </h5>
          <small class="mb-4 text-muted"
            >Mohon lihat email Anda untuk detail pembatalan.</small
          >
        </div>
        <div class="mt-4">
          <h4 class="fw-semibold">Tentang Konsultasi</h4>
          <div class="mt-3">
            <p class="text-muted mb-1 fw-semibold">
              <i class="bi bi-camera-video-fill me-2"></i>Link Pertemuan:
            </p>
            <span class="ms-4" v-if="history.status === 'Selesai'">
              Konsultasi telah dilaksanakan
            </span>
            <span class="ms-4" v-else-if="history.status === 'Dibatalkan'">
              Konsultasi telah dibatalkan
            </span>
          </div>
          <div class="mt-3">
            <p class="text-muted mb-1 fw-semibold">
              <i class="bi bi-chat-left-quote-fill me-2"></i>Topik Konsultasi:
            </p>
            <span class="ms-4"
              >Perkembangan perekonomian mikro dan makro di Jawa Timur</span
            >
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-6">
            <p class="fw-semibold text-muted mb-2">
              <i class="bi bi-person-fill me-2"></i>Informasi Petugas:
            </p>
            <p class="mb-0 ms-4">Arih Thoyibatul I</p>
            <p class="mb-0 ms-4">BPS Provinsi Jawa Timur</p>
          </div>
          <div class="col-6">
            <p class="fw-semibold text-muted mb-2">
              <i class="bi bi-calendar2-week-fill me-2"></i> Jadwal Konsultasi:
            </p>
            <p class="mb-0 ms-4">14 Mei 2024</p>
            <p class="mb-0 ms-4">09.00 - 10.00</p>
          </div>
        </div>
        <hr />
        <div class="mt-3" v-if="history.status === 'Dibatalkan'">
          <h4 class="fw-semibold">Informasi Pembatalan</h4>
          <div class="mt-3">
            <p class="text-muted mb-1 fw-semibold">
              <i class="bi bi-caret-right-fillme-2"></i>Pihak yang membatalkan:
              Nama User
            </p>
          </div>
          <div class="mt-3">
            <p class="text-muted mb-1 fw-semibold">
              <i class="bi bi-chat-left-quote-fill me-2"></i>Alasan Pembatalan:
            </p>
            <span class="ms-4"
              >Terjadi kesalahan pemilihan tanggal saat mengisi reservasi
              konsultasi</span
            >
          </div>
          <hr />
        </div>

        <div class="d-block">
          <p class="mb-0">
            <small class="mb-2 fw-semibold">Tanggal Pembuatan Reservasi</small>
          </p>
          <p>
            <small>{{ history.tanggal_reservasi }}</small>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardDetailHistory",
  props: {
    historyId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      history: {},
      loading: true,
    };
  },
  created() {
    this.fetchBookingDetails(this.historyId);
  },
  methods: {
    fetchBookingDetails(bookingId) {
      // Simulasi permintaan API untuk mendapatkan detail reservasi berdasarkan bookingId
      // Ganti ini dengan permintaan sesungguhnya ke API Anda
      // Misalnya:
      // axios.get(`/api/bookings/${bookingId}`)
      // .then(response => {
      //     this.booking = response.data;
      //   })
      // .catch(error => {
      //     console.error("Error fetching booking details:", error);
      //   });

      // Simulasi data dummy
      this.history = {
        id: bookingId,
        status: "Dibatalkan",
        tanggal: "2024-05-10",
        jam: "09:00",
        nama_agen: "Agen 1",
        link_meet: "https://example.com/meet",
        tanggal_reservasi: "2024-05-08",
        satker_agen: "BPS Provinsi Jawa Timur",
      };
      this.loading = false;
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.card-body {
  padding: 2rem;
}

.list-group-item {
  padding: 0.5rem 1rem;
  border: none;
}

.list-group-item strong {
  font-weight: 500;
}

.btn-danger {
  width: 100%;
  margin-top: 1rem;
}
</style>
