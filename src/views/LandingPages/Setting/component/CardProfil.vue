<template>
  <div class="card shadow-sm  border-0 ">
    <div class="card-header p-4 pb-2">
      <h4 class="card-title mb-3">Lihat/Ubah Data Diri</h4>
      <p class="card-text">
        <small class="text-muted mb-2">Silahkan lengkapi data diri anda!</small>
      </p>
    </div>
    <div class="card-body m-3 mt-0">
      <div v-if="isLoading" class="text-center">
        <img src="/assets/loading_2.svg" alt="Loading..." />
        <p>Loading...</p>
      </div>
      <div v-else>
        <div v-for="(field, key) in userFields" :key="key" class="mb-3">
          <p class="card-text mb-0">{{ field.label }}*</p>
          <p class="card-text">
            <small class="text-muted">{{ field.value || "-" }}</small>
          </p>
        </div>
        <form @submit.prevent="saveData">
          <div v-for="input in formInputs" :key="input.id" class="mb-3">
            <label :for="input.id" class="form-label">{{ input.label }}</label>
            <select
              v-if="input.type === 'select'"
              :class="[
                'form-select',
                { 'is-invalid': !apiData[input.id] && input.required },
              ]"
              :id="input.id"
              v-model="apiData[input.id]"
              @change="validateField(input.id)"
              :required="input.required"
            >
              <option value="">Pilih {{ input.label }}</option>
              <option
                v-for="option in input.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <input
              v-else
              :type="input.type"
              :class="[
                'form-control',
                { 'is-invalid': !apiData[input.id] && input.required },
              ]"
              :id="input.id"
              v-model="apiData[input.id]"
              @input="validateField(input.id)"
              :required="input.required"
            />
            <div class="invalid-feedback">{{ input.error }}</div>
          </div>
          <p class="card-text mt-3">
            <small class="text-muted">*) data wajib di isi</small>
          </p>
          <button
            type="submit"
            class="btn btn-success w-100"
            :disabled="!isFormValid"
          >
            Simpan
          </button>
        </form>
      </div>
    </div>

    <!-- Modal for Success Notification -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-content">
        <p>Perubahan berhasil disimpan!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";
import { apiService } from "@/api/ApiService";

export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
    cardApiUrl: {
      type: String,
    },
  },
  data() {
    return {
      apiData: {
        pekerjaan: "",
        jenis_kelamin: "",
        tanggal_lahir: "",
        id_prov: "",
        id_kab: "",
        nmr_telp: "",
        pendidikan: "",
      },
      formInputs: [
        {
          id: "pekerjaan",
          label: "Pekerjaan",
          type: "select",
          required: true,
          options: [
            { label: "Pelajar/Mahasiswa", value: "Pelajar/Mahasiswa" },
            { label: "Peneliti", value: "peneliti" },
            { label: "Karyawan Swasta", value: "karyawan_swasta" },
            { label: "Wiraswasta", value: "wiraswasta" },
            { label: "Peneliti", value: "Peneliti" },
            { label: "Aparatur Sipil Negara", value: "Aparatur Sipil Negara" },
          ],
        },
        {
          id: "jenis_kelamin",
          label: "Jenis Kelamin",
          type: "select",
          required: true,
          options: [
            { label: "Perempuan", value: "Perempuan" },
            { label: "Laki-laki", value: "Laki-Laki" },
          ],
        },
        {
          id: "tanggal_lahir",
          label: "Tanggal Lahir",
          type: "date",
          required: true,
        },
        {
          id: "id_prov",
          label: "Asal Provinsi",
          type: "select",
          required: true,
          options: [],
        },
        {
          id: "id_kab",
          label: "Asal Kabupaten/Kota",
          type: "select",
          required: true,
          options: [],
        },
        {
          id: "nmr_telp",
          label: "Nomor Handphone",
          type: "tel",
          required: true,
        },
        {
          id: "pendidikan",
          label: "Pendidikan Terakhir",
          type: "select",
          required: true,
          options: [
            { label: "SMA Sederajat", value: "SMA Sederajat" },
            { label: "Diploma", value: "Diploma" },
            { label: "S1", value: "S1" },
            { label: "S2", value: "S2" },
            { label: "S3", value: "S3" },
          ],
        },
      ],
      userFields: [
        { label: "Nama Panjang", value: this.user.nama_pengguna },
        { label: "Email", value: this.user.email_google },
        { label: "Nama Depan", value: this.user.given_name },
        { label: "Nama Belakang", value: this.user.family_name },
      ],
      showModal: false, // State for controlling modal visibility
      isLoading: true,
    };
  },
  computed: {
    isFormValid() {
      return this.formInputs.every(
        (input) => !input.required || this.apiData[input.id]
      );
    },
  },
  created() {
    this.fetchProvinces();
    this.fetchData();
  },
  methods: {
    fetchData() {
      const storedUser = localStorage.getItem("user");
      const storedLoggedIn = localStorage.getItem("loggedIn");

      if (storedUser && storedLoggedIn) {
        const parsedUser = JSON.parse(storedUser);
        console.log(parsedUser);

        // Set apiData fields with defaults if null or undefined
        this.apiData.pekerjaan = parsedUser.pekerjaan ?? "";
        this.apiData.jenis_kelamin = parsedUser.jenis_kelamin ?? "";
        this.apiData.tanggal_lahir = parsedUser.tanggal_lahir ?? "";
        this.apiData.id_prov = parsedUser.id_prov ?? "";
        this.apiData.id_kab = parsedUser.id_kab ?? "";
        this.apiData.nmr_telp = parsedUser.nmr_telp ?? "";
        this.apiData.pendidikan = parsedUser.pendidikan ?? "";

        // Set user fields with defaults if null or undefined
        this.user.nama_pengguna = parsedUser.nama_pengguna ?? "-";
        this.user.email_google = parsedUser.email_google ?? "-";
        this.user.given_name = parsedUser.given_name ?? "-";
        this.user.family_name = parsedUser.family_name ?? "-";
        this.user.foto = parsedUser.foto ?? "";
      }
      this.isLoading = false;
    },
    saveData() {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          throw new Error("No user data found in local storage");
        }
        const parsedUser = JSON.parse(storedUser);

        // Assuming apiData is a property in your class
        if (!this.apiData) {
          throw new Error("No API data found to update the user");
        }

        // Update the user using the API service
        apiService
          .updateUser(parsedUser.id, this.apiData)
          .then((response) => {
            console.log("User updated successfully");

            // Show success modal
            this.showModal = true;

            // Hide modal after 2 seconds
            setTimeout(() => {
              this.showModal = false;
            }, 1000);

            const dataUserBaru = response.data.data;
            // Simpan data yang telah diubah kembali ke local storage
            localStorage.setItem("user", JSON.stringify(dataUserBaru));

            this.isLoading = true;
            this.fetchData();
          })
          .catch((error) => {
            console.error("Error:", error.message);
          });
      } catch (error) {
        console.error("Error:", error.message);
      }
    },
    validateField(field) {
      const input = this.formInputs.find((input) => input.id === field);
      input.error =
        this.apiData[field] || !input.required ? "" : "Kolom ini harus diisi";
    },
    fetchProvinces() {
      apiService
        .getAllProvinces()
        .then((response) => {
          const provinces = response.data.data;
          const provinceInput = this.formInputs.find(
            (input) => input.id === "id_prov"
          );
          if (provinceInput) {
            provinceInput.options = provinces.map((province) => ({
              label: province.nama_prov,
              value: province.id_prov,
            }));
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    fetchCities(provinceId) {
      apiService
        .getKabupatenByProvinsi(provinceId)
        .then((response) => {
          const cities = response.data.data;
          const cityInput = this.formInputs.find(
            (input) => input.id === "id_kab"
          );
          if (cityInput) {
            cityInput.options = cities.map((city) => ({
              label: city.nama_kab,
              value: city.id_kab,
            }));
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  watch: {
    "apiData.id_prov"(newProvinceId) {
      if (newProvinceId) {
        this.fetchCities(newProvinceId);
      } else {
        const cityInput = this.formInputs.find(
          (input) => input.id === "id_kab"
        );
        if (cityInput) {
          cityInput.options = [];
        }
      }
    },
  },
};
</script>

<style scoped>

.card-header {
  border-bottom: none;
}

.card-body {
  padding: 1rem;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.form-select {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

.form-select:focus {
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.invalid-feedback {
  display: block;
}

/* Modal styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content {
  background: #fff;
  padding: 1rem 1.5rem;
  border-radius: 0.3rem;
  text-align: center;
}
</style>
