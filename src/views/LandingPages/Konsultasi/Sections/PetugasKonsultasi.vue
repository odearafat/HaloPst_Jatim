<script setup>
import { ref, computed, onMounted, watch } from "vue";
import CariWilayah from "./CariWilayahKonsultasi.vue";
import { useRouter } from "vue-router";
import PetugasKonsultasiCard from "@/examples/cards/teamCards/PetugasKonsultasiCard.vue";
import MaterialPagination from "@/components/MaterialPagination.vue";
import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";
import SpesialisasiKonsultasi from "./SpesialisasiKonsultasi.vue";
import { apiService } from "@/api/ApiService";

const emit = defineEmits(['keahlianClicked']);
const props = defineProps({
  mfd: {
    type: String,
    required: true,
  },
});

const petugasKonsultasi = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const itemsPerPage = ref(6);
const router = useRouter();

const fetchPetugas = async (mfd) => {
  loading.value = true;
  try {
    const response = await apiService.getOfficersBySatker(mfd);
    //console.log(response.data);
    if(response.data==400){
      router.push({ name: 'login' });
    }else{
      petugasKonsultasi.value = response.data.data;
    }
    
  } catch (error) {
    console.error("Error fetching petugas konsultasi:", error);
  } finally {
    loading.value = false;
  }
};

const fetchPetugasBySatker = async (satker) => {
  loading.value = true;
  try {
    const response = await apiService.getOfficersBySatker(satker);
    petugasKonsultasi.value = response.data.data;
  } catch (error) {
    console.error("Error fetching petugas konsultasi by satker:", error);
  } finally {
    loading.value = false;
  }
};

const fetchPetugasByKeahlian = async (keahlianId) => {
  loading.value = true;
  try {
    const response = await apiService.getPetugasByKeahlian(keahlianId);
    petugasKonsultasi.value = response.data.data;
  } catch (error) {
    console.error("Error fetching petugas konsultasi by keahlian:", error);
  } finally {
    loading.value = false;
  }
};

const handleCariWilayahInput = (satker) => {
  fetchPetugasBySatker(satker);
};

function keahlianClicked(){
  emit('keahlianClicked')
}

const handleKeahlian = (itemId) => {
  fetchPetugasByKeahlian(itemId);
};

const handleHapusFilter = () => {
  fetchPetugas(props.mfd);
};

const paginatedPetugas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return petugasKonsultasi.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(petugasKonsultasi.value.length / itemsPerPage.value);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

onMounted(() => {
  fetchPetugas(props.mfd);
});

watch(() => props.mfd, (newMfd) => {
  fetchPetugas(newMfd);
});
</script>

<template>
  <section class="pb-5 satker-relative bg-gradient-dark mx-n3">
    <div class="container">
      <div class="row">
        <div class="col-md-6 text-start mb-3 mt-5">
          <CariWilayah @data="handleCariWilayahInput" />
        </div>
        <div class="col-md-6 text-end mb-3 mt-5">
          <button class="btn btn-danger" @click="handleHapusFilter">Hapus Filter</button>
        </div>
        <div class="col-md-12 text-start mb-5">
          <h3 class="text-white z-index-1 satker-relative">Konsultasi Umum</h3>
          <p class="text-white text-dark mb-0">
            Pilih petugas layanan berikut jika Anda ingin berkonsultasi terkait data statistik secara umum
          </p>
        </div>
      </div>
      <div class="row">
        <div v-if="loading" class="text-center">
          <img src="/assets/loading_2.svg" alt="Loading..." />
          <p class="fw-bold fs-3 text-light">Loading...</p>
        </div>
        <div v-else-if="petugasKonsultasi.length == 0" class="text-center">
          <p>Tidak ada petugas ditemukan.</p>
        </div>
        <div v-else class="col-lg-4 col-6 mb-6" v-for="petugas in paginatedPetugas" :key="petugas.id">
            <PetugasKonsultasiCard style="height: 100%;" class="mt-4" :petugas="petugas" />
        </div>
      </div>
      <div class="container pt-5">
        <div class="row justify-content-center">
          <div class="col-lg-4">
            <div class="pagination-container">
              <MaterialPagination>
                <MaterialPaginationItem prev @click="changePage(currentPage - 1)" />
                <MaterialPaginationItem
                  v-for="page in totalPages"
                  :key="page"
                  :label="page"
                  :active="page == currentPage"
                  @click="changePage(page)"
                />
                <MaterialPaginationItem next @click="changePage(currentPage + 1)" />
              </MaterialPagination>
            </div>
          </div>
        </div>
      </div>
      <div class="row pt-3">
        <div class="col-md-8 text-start mb-5 mt-2">
          <h3 class="text-white z-index-1 satker-relative">Cari Statistisi Ahli atau Spesialisasi</h3>
          <p class="text-white text-dark mb-0">
            Pilih kategori yang tersedia sesuai masalah Anda
          </p>
        </div>
      </div>
      <SpesialisasiKonsultasi @item="handleKeahlian" @click="keahlianClicked" />
    </div>
  </section>
</template>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
}
</style>
