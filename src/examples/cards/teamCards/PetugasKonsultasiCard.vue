<script setup>
import { ref } from "vue";
import router from "@/router";
import MaterialBadge from "../../../components/MaterialBadge.vue";
import Modal from "../../../views/LandingPages/Konsultasi/Sections/RsvpModal.vue";

// Mendefinisikan props
const props = defineProps({
  petugas: {
    type: Object,
    required: true,
    id: Number,
    nama_petugas: String,
    email_bps: String,
    id_satker: String,
    jabatan: String,
    foto: String,
    satker: Object,
    keahlian: Array,
  },
});

// Mendefinisikan data dan methods
const isModalVisible = ref(false);
const isLoading = ref(false);
const isSuccess = ref(false);
const isModalMainVisible = ref(true);
const user = ref(JSON.parse(localStorage.getItem("user")) || {});

function showModal() {
  const isLogin = localStorage.getItem("loggedIn");
  if (isLogin === "true") {
    isModalVisible.value = true;
    isModalMainVisible.value = true;
  } else {
    router.push({ name: "login" });
  }
}

function closeModal() {
  isModalVisible.value = false;
}

function setLoading(value) {
  isLoading.value = value;
}

function setSuccess(value) {
  isSuccess.value = value;
}

function hideMainModal() {
  isModalMainVisible.value = false;
}

function closeSuccessModal() {
  isSuccess.value = false;
  window.location.href = "/settings/booking";
}
</script>

<template>
  <div class="card card-profile">
    <div class="row">
      <div class="col-lg-4 col-md-6 col-12 mt-n5">
        <div class="p-3 pe-md-0">
          <img class="w-100 border-radius-md shadow-lg" :src="petugas.foto" :alt="petugas.nama_petugas" />
        </div>
      </div>
      <div class="col-lg-8 col-md-6 col-12 my-auto">
        <div class="card-body ps-lg-0">
          <h6 class="mb-0">{{ petugas.nama_petugas }}</h6>
          <p class="text-weight-bold text-sm mb-0 text-success">{{ petugas.satker.nama_satker }}</p>
          <p class="mb-2 text-xs">
            <i class="fa fa-briefcase text-xs margin-right-4"></i>
            {{ petugas.jabatan }}
          </p>
          <div class="col-lg-12">
            <MaterialBadge
              color="gray-300"
              class="mb-1 text-dark opacity-6"
              style="margin-right: 2px; text-transform: none"
              v-for="topik in petugas.keahlian"
              :key="topik.id"
            >
              {{ topik.nama_keahlian }}
            </MaterialBadge>
          </div>
          <div class="col-lg-12">
            <a @click="showModal" class="btn btn-sm bg-gradient-danger mt-2 mb-0" style="text-transform: none">
              Buat Reservasi
            </a>
          </div>
        </div>
      </div>
    </div>
    <Modal
      v-if="isModalVisible"
      @close="closeModal"
      @loading="setLoading"
      @success="setSuccess"
      @hideMainModal="hideMainModal"
      :petugas="petugas"
      :pengguna="user"
      :isModalMainVisible="isModalMainVisible"
    />
    <!-- Modal Loading -->
    <div v-if="isLoading" class="modal-backdrop">
      <div class="modal position-static d-block p-4 py-md-5">
        <div class="modal-dialog" role="document">
          <div class="modal-content rounded-4 shadow px-2">
            <div class="modal-body py-5">
              <div class="d-flex justify-content-center align-items-center">
                <div class="spinner-border text-success" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <span class="ms-3">Mengirim reservasi...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Success -->
    <div v-if="isSuccess" class="modal-backdrop">
      <div class="modal position-static d-block p-4 py-md-5">
        <div class="modal-dialog" role="document">
          <div class="modal-content rounded-4 shadow px-2">
            <div class="modal-body py-5">
              <div class="d-flex justify-content-center align-items-center">
                <i class="bi bi-check-circle text-success" style="font-size: 2rem"></i>
                <span class="ms-3 fs-5">Reservasi berhasil dikirim.</span>
              </div>
              <div class="d-flex justify-content-center mt-1">
                <span class="fw-semibold text-center">Dimohon untuk memeriksa inbox email anda secara berkala</span>
              </div>
              <div class="d-flex justify-content-center mt-3">
                <button type="button" class="btn btn-success" @click="closeSuccessModal">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
