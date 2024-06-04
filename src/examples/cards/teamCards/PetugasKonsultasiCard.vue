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
const user = ref(JSON.parse(localStorage.getItem("userData")) || {});

function showModal() {
  const isLogin = localStorage.getItem("loggedIn");

  if (isLogin === true) {
    isModalVisible.value = true;
  }else{
    router.push({ name: 'login' });
  }
}

function closeModal() {
  isModalVisible.value = false;
}
</script>

<template>
  <div class="card card-profile">
    <div class="row">
      <div class="col-lg-4 col-md-6 col-12 mt-n5">
        <div class="p-3 pe-md-0">
          <img
            class="w-100 border-radius-md shadow-lg"
            :src="petugas.foto"
            :alt="petugas.nama_petugas"
          />
        </div>
      </div>
      <div class="col-lg-8 col-md-6 col-12 my-auto">
        <div class="card-body ps-lg-0">
          <h6 class="mb-0">{{ petugas.nama_petugas }}</h6>
          <p
            class="text-weight-bold text-sm mb-0"
            :class="`text-${petugas.satker.color}`"
          >
            {{ petugas.satker.nama_satker }}
          </p>
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
            <a
              @click="showModal"
              class="btn btn-sm bg-gradient-danger mt-2 mb-0"
              style="text-transform: none"
            >
              Buat Reservasi
            </a>
          </div>
        </div>
      </div>
    </div>
    <Modal
      v-show="isModalVisible"
      @close="closeModal"
      :petugas="petugas"
      :pengguna="user"
    />
  </div>
</template>
