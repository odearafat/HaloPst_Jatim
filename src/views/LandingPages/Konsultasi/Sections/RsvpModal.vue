<template>
  <div class="modal-backdrop">
    <div
      class="modal position-static d-block p-4 py-md-5"
      tabindex="-1"
      role="dialog"
      id="modalSheet"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content rounded-4 shadow px-2">
          <div class="modal-header border-bottom-0">
            <h4 class="modal-title fw-semibold text-success d-block">
              RESERVASI KONSULTASI ONLINE
            </h4>
            <button
              type="button"
              class="bi bi-x"
              @click="close"
            ></button>
          </div>
          <div
            class="alert alert-primary modal-body mx-2 p-2"
            role="alert"
            id="alert"
          >
            <div class="row">
              <div class="col-auto ms-1">
                <i class="bi bi-info-circle" style="color: #ffff"></i>
              </div>
              <div class="col p-0">
                <small style="color: #ffff"
                  >Petugas pelayanan bisa saja berganti disesuaikan dengan beban
                  petugas yang ada</small
                >
              </div>
            </div>
          </div>
          <div class="modal-body py-0">
            <div class="row">
              <div class="col-md-6 d-flex">
                <i class="bi bi-person-vcard me-2"></i>
                <div>
                  <p class="fw-semibold mb-0 text-muted">Data Petugas:</p>
                  <p class="mb-0">
                    <small>{{ petugas.nama_petugas }}</small>
                  </p>
                  <p>
                    <small>{{ petugas.satker.nama_satker }}</small>
                  </p>
                </div>
              </div>
              <div class="col-md-6 d-flex">
                <i class="bi bi-person-vcard me-2"></i>
                <div class="pe-2">
                  <p class="fw-semibold mb-0 text-muted">Data Pengguna:</p>
                  <p class="mb-0">
                    <small>{{ pengguna.name }}</small>
                  </p>
                  <p>
                    <small>{{ pengguna.email }}</small>
                  </p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <h5>Jadwal Konsultasi:</h5>
                <div class="form-group">
                  <label for="tanggal">Tanggal:</label>
                  <input
                    type="date"
                    id="tanggal"
                    v-model="tanggal"
                    class="form-control"
                    :min="minDate"
                  />
                  <small v-if="invalidDate" class="text-danger">
                    Tanggal yang dipilih tidak valid. Pilih hari antara Senin
                    hingga Jumat.
                  </small>
                </div>
                <div class="form-group mt-3">
                  <label for="jam">Jam:</label>
                  <input
                    type="time"
                    id="jam"
                    v-model="jam"
                    class="form-control"
                    style="outline-color: #000"
                  />
                  <small v-if="invalidTime" class="text-danger">
                    Jam yang dipilih tidak valid. Pilih jam antara 08.00-12.00
                    atau 13.00-16.00.
                  </small>
                </div>
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-md-12">
                <h5>Topik Konsultasi:</h5>
                <textarea
                  v-model="topik"
                  rows="5"
                  cols="30"
                  class="w-100 rounded rounded-2 p-2"
                  placeholder="Masukan topik yang ingin Anda diskusikan..."
                ></textarea>
              </div>
            </div>
          </div>
          <div
            class="modal-footer flex-column align-items-stretch w-100 gap-2 pb-3 border-top-0"
          >
            <button
              type="button"
              class="btn btn-success"
              @click="submitReservation"
            >
              Kirim!
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiService } from "@/api/ApiService";

export default {
  name: "Modal",
  props: {
    petugas: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tanggal: "",
      minDate: "",
      jam: "",
      topik: "",
      invalidTime: false,
      invalidDate: false,
      pengguna: {
        name: "",
        email: "",
      },
    };
  },
  created() {
    this.setMinDate();
    this.fetchData();
  },
  methods: {
    fetchData() {
      const storedUser = localStorage.getItem("user");
      const storedLoggedIn = localStorage.getItem("loggedIn");

      if (storedLoggedIn && storedUser) {
        const parsedUser = JSON.parse(storedUser);

        this.pengguna.name = parsedUser.nama_pengguna;
        this.pengguna.email = parsedUser.email_google;
      }
    },
    setMinDate() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
      const dd = String(today.getDate()).padStart(2, "0");
      this.minDate = `${yyyy}-${mm}-${dd}`;
    },
    close() {
      this.$emit("close");
    },
    validateJam() {
      const [jam, menit] = this.jam.split(":");
      const hour = parseInt(jam, 10);
      const minute = parseInt(menit, 10);

      const validTime =
        (hour >= 8 && hour < 12) || // Between 08:00 and 11:59
        (hour === 12 && minute === 0) || // Exactly at 12:00
        (hour >= 13 && hour < 16) || // Between 13:00 and 15:59
        (hour === 16 && minute === 0); // Exactly at 16:00

      if (!validTime) {
        this.invalidTime = true;
      } else if (this.isToday(this.tanggal) && !this.validateTimeForToday(hour, minute)) {
        this.invalidTime = true;
      } else {
        this.invalidTime = false;
      }
    },
    validateTimeForToday(hour, minute) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const selectedTime = new Date();
      selectedTime.setHours(hour);
      selectedTime.setMinutes(minute);

      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      return selectedTime >= oneHourFromNow;
    },
    validateTanggal() {
      const selectedDate = new Date(this.tanggal);
      const day = selectedDate.getUTCDay();

      // Check if the day is Saturday (6) or Sunday (0)
      if (day === 0 || day === 6) {
        this.invalidDate = true;
      } else {
        this.invalidDate = false;
      }
    },
    isToday(date) {
      const today = new Date();
      const selectedDate = new Date(date);

      return (
        today.getFullYear() === selectedDate.getFullYear() &&
        today.getMonth() === selectedDate.getMonth() &&
        today.getDate() === selectedDate.getDate()
      );
    },
    submitReservation() {
      this.validateJam();
      this.validateTanggal();

      if (!this.invalidTime && !this.invalidDate && this.tanggal && this.jam && this.topik) {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser) {
          const dataApi = {
            tanggal_konsultasi: this.tanggal,
            waktu_konsultasi: this.jam,
            topik_diskusi: this.topik,
            id_petugas: this.petugas.id,
            id_pengguna: storedUser.id,
          };

          // Mengirim data ke API
          apiService.addConsultation(dataApi)
            .then((response) => {
              console.log("Reservation submitted successfully", response.data);
              // Tambahkan logika tambahan di sini jika diperlukan, seperti menampilkan notifikasi
              alert("Reservasi berhasil dikirim.");
              this.close(); // Menutup modal setelah pengiriman sukses
              this.$router.push("/settings/booking");
            })
            .catch((error) => {
              console.error("Error submitting reservation", error);
              alert("Terjadi kesalahan saat mengirim reservasi. Silakan coba lagi.");
            });
        } else {
          alert("Pengguna tidak ditemukan. Silakan login kembali.");
        }
      } else {
        alert("Pastikan semua field terisi dengan benar.");
      }
    },
  },
  watch: {
    jam(newVal) {
      if (newVal) {
        this.validateJam();
      }
    },
    tanggal(newVal) {
      if (newVal) {
        this.validateTanggal();
      }
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
