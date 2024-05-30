<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header p-4">
      <h4 class="card-title">Daftar History</h4>
      <p class="card-text">
        <small class="text-muted mb-4"
          >Anda dapat melihat daftar history konsultasi anda disini!</small
        >
      </p>
    </div>
    <div class="card-body m-3">
      <table class="table table-bordered" v-if="!loading">
        <thead>
          <tr>
            <th scope="col" class="text-center">Tanggal</th>
            <th scope="col" class="text-center">Nama Agen</th>
            <th scope="col" class="text-center">Status</th>
            <th scope="col" class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(history, index) in histories" :key="index">
            <td><small>{{ history.tanggal }}</small></td>
            <td><small>{{ history.nama_agen }}</small></td>
            <td>
              <span
                class="badge bg-success"
                v-if="history.status === 'selesai'"
              >
                Selesai
              </span>
              <span
                class="badge bg-danger"
                v-else-if="history.status === 'dibatalkan'"
              >
                Dibatalkan
              </span>
            </td>
            <td class="d-flex justify-content-center align-items-center">
              <button
                class="btn btn-info me-2 btn-sm"
                v-if="history.status === 'selesai'"
                @click="showModal(history)"
              >
                Ulasan
              </button>
              <button
                class="btn btn-warning me-2 btn-sm"
                v-if="history.status === 'selesai'"
                @click="showDetail(history.id)"
              >
                Detail
              </button>
              <button
                class="btn btn-warning btn-sm"
                v-else-if="history.status === 'dibatalkan'"
                @click="showDetail(history)"
              >
                Detail
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-center" v-else>
        <i style="font-size: 24px"></i>
        <img src="@\assets\loading_2.svg" />
        <!-- Ganti path sesuai kebutuhan -->
        <p>Loading...</p>
      </div>
    </div>
    <ModalUlasan v-show="isModalVisible" :history="selectedHistory" @close="closeModal"/>
  </div>
</template>

<script>
import axios from "axios"; // Import axios
import ModalUlasan from "./ModalUlasan.vue";

export default {
  components:{ModalUlasan},
  props: {
    cardApiUrl: {
      type: String, // Changed type to String
    },
  },
  data() {
    return {
      histories: [],
      loading: true,
      isModalVisible:false,
      selectedHistory: null
    };
  },
  mounted() {
    // this.fetchHistories();
    this.dummyload();
  },
  methods: {
    fetchHistories() {
      this.loading = true;
      axios
        .get(this.cardApiUrl)
        .then((response) => {
          this.histories = response.data;
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },
    dummyload() {
      this.loading = true;
      setTimeout(() => {
        // Simulasi data dummy
        const dummyData = [
          {
            id: 1,
            tanggal: "2024-05-01",
            nama_agen: "Pramana Yhoga C K",
            topik_pembahasan: "index harga pokok",
            status: "selesai",
          },
          {
            id: 2,
            tanggal: "2024-05-02",
            nama_agen: "La Ode Ahmad Arafat",
            topik_pembahasan: "Pendapatan perwilayah",
            status: "dibatalkan",
          },
          {
            id: 3,
            tanggal: "2024-05-03",
            nama_agen: "Peni Meivita",
            topik_pembahasan: "Data pariwisata di jawa timur",
            status: "selesai",
          },
        ];
        // Assign data dummy ke histories dan set loading ke false setelah selesai
        this.histories = dummyData;
        this.loading = false;
      }, 1000); // Delay selama 1 detik (1000 milidetik)
    },
    showDetail(historyId) {
      // Lakukan navigasi ke route CardDetailBooking dengan mengirimkan bookingId sebagai parameter
      this.$router.push({
        name: "CardDetailHistory",
        params: { id: historyId },
      });
    },
    showModal(history) {
      this.selectedHistory = history;
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },

  },
};
</script>
