<template>
  <div class="modal-backdrop">
    <div
      class="modal position-static d-block p-4 py-md-5"
      id="ratingModal"
      tabindex="-1"
      aria-labelledby="ratingModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content rounded-4 shadow px-2">
          <div class="modal-header border-bottom-0">
            <h5
              class="modal-title fs-4 fw-semibold text-success"
              id="ratingModalLabel"
            >
              Nilai dan Ulasan
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="close"
            >
              <i class="bi bi-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <div class="d-flex justify-content-center">
                  <div class="text-center mb-5">
                    <label for="review" class="form-label"
                      >Berikan Nilai dan Ulasan terkait pelayanan kami</label
                    >
                    <div class="rating">
                      <input
                        type="radio"
                        name="rating"
                        value="5"
                        id="5"
                        class="star"
                        v-model="rating"
                      /><label for="5" class="star">☆</label>
                      <input
                        type="radio"
                        name="rating"
                        value="4"
                        id="4"
                        class="star"
                        v-model="rating"
                      /><label for="4" class="star">☆</label>
                      <input
                        type="radio"
                        name="rating"
                        value="3"
                        id="3"
                        class="star"
                        v-model="rating"
                      /><label for="3" class="star">☆</label>
                      <input
                        type="radio"
                        name="rating"
                        value="2"
                        id="2"
                        class="star"
                        v-model="rating"
                      /><label for="2" class="star">☆</label>
                      <input
                        type="radio"
                        name="rating"
                        value="1"
                        id="1"
                        class="star"
                        v-model="rating"
                      /><label for="1" class="star">☆</label>
                    </div>
                    <div class="mb-3">
                      <textarea
                        v-model="review"
                        class="w-100 p-2"
                        id="review"
                        rows="3"
                        placeholder="Silahkan masukan saran"
                      ></textarea>
                      <p class="mt-3">
                        <small
                          >Penilaian dan ulasan Anda sangat penting bagi kami
                          untuk meningkatkan kualitas layanan Konsultasi Online
                          BPS Provinsi Jawa Timur.
                        </small>
                      </p>
                    </div>
                    <div class="buttons mt-0">
                      <button
                        type="button"
                        class="btn btn-success py-1 rounded rounded-4"
                        @click="sendReview"
                        :disabled="review.length < 0 && rating.value < 0"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiService } from "@/api/ApiService";

export default {
  name: "ModalUlasan",
  props: {
    historyId: {
      required: true,
    },
  },
  data() {
    return {
      review: "",
      rating: "",
    };
  },
  methods: {
    async sendReview() {
      console.log(this.historyId);
      try {
        // Validasi
        if (!this.rating) {
          throw new Error("Harap pilih nilai rating.");
        }
        if (!this.review.trim()) {
          throw new Error("Harap isi bagian ulasan.");
        }

        // Persiapan data untuk dikirim
        const data = {
          rating: this.rating,
          kritik_saran: this.review,
        };

        // Kirim ulasan menggunakan API Service
        await apiService.giveFeedback(this.historyId, data);

        // Tampilkan pesan sukses
        console.log(data);
        console.log(`Booking ID ${this.historyId} sudah di review.`);
        alert("Ulasan berhasil dikirim.");

        // Tutup modal
        this.close();

        // Reload halaman
        window.location.reload();
      } catch (error) {
        // Tangani kesalahan
        console.error("Error saat melakukan review:", error.message);
        alert("Gagal mengirim ulasan. Silakan coba lagi.");
      }
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #0000009c;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  color: #4aae9b;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  flex-direction: column;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
}

.rate {
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
}

.rating {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
}

.rating > input {
  display: none;
}

.rating > label {
  position: relative;
  width: 1em;
  font-size: 30px;
  font-weight: 300;
  color: #ffd600;
  cursor: pointer;
}

.rating > label::before {
  content: "\2605";
  position: absolute;
  opacity: 0;
}

.rating > label:hover:before,
.rating > label:hover ~ label:before {
  opacity: 1 !important;
}

.rating > input:checked ~ label:before {
  opacity: 1;
}

.rating:hover > input:checked ~ label:before {
  opacity: 0.4;
}

.buttons {
  position: relative;
  top: 36px;
}
</style>
