<template>
  <div class="card shadow-sm">
    <div class="card-header p-4 pb-2">
      <h4 class="card-title mb-3">Lihat/Ubah Data Diri</h4>
      <p class="card-text">
        <small class="text-muted mb-2">Silahkan lengkapi data diri anda!</small>
      </p>
    </div>
    <div class="card-body m-3 mt-0">
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
          value:this.user.pekerjaan,
          options: [
            { label: "Mahasiswa/Pelajar", value: "Mahasiswa_pelajar" },
            { label: "Peneliti", value: "peneliti" },
            { label: "Karyawan Swasta", value: "karyawan_swasta" },
            { label: "Wiraswasta", value: "wiraswasta" },
            { label: "Peneliti", value: "Peneliti" },
            { label: "Aparatur Sipil Negara", value: "ASN" },
          ],
        },
        {
          id: "jenis_kelamin",
          label: "Jenis Kelamin",
          type: "select",
          required: true,
          value:this.user.jenis_kelamin,
          options: [
            { label: "Perempuan", value: "Perempuan" },
            { label: "Laki-laki", value: "Laki-laki" },
          ],
        },
        {
          id: "tanggal_lahir",
          label: "Tanggal Lahir",
          type: "date",
          value:this.user.tanggal_lahir,
          required: true,
        },
        {
          id: "id_prov",
          label: "Asal Provinsi",
          type: "select",
          required: true,
          value:this.user.id_prov,
          options: [],
        },
        {
          id: "id_kab",
          label: "Asal Kabupaten/Kota",
          type: "select",
          required: true,
          value:this.user.id_kab,
          options: [],
        },
        {
          id: "nmr_telp",
          label: "Nomor Handphone",
          type: "tel",
          value:this.user.nmr_telp,
          required: true,
        },
        {
          id: "pendidikan",
          label: "Pendidikan Terakhir",
          type: "select",
          value:this.user.pendidikan,
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
    const storedUser = localStorage.getItem("user");
    const storedLoggedIn = localStorage.getItem("loggedIn");

    if (storedUser && storedLoggedIn) {
      const parsedUser = JSON.parse(storedUser);
      console.log(parsedUser)
      // Set user fields with defaults if null or undefined
      this.user.nama_pengguna = parsedUser.nama_pengguna ?? '-';
      this.user.email_google = parsedUser.email_google ?? '-';
      this.user.given_name = parsedUser.given_name ?? '-';
      this.user.family_name = parsedUser.family_name ?? '-';
      this.user.foto = parsedUser.foto ?? '';
      this.user.id_kab = parsedUser.id_kab ?? '';
      this.user.id_prov = parsedUser.id_prov ?? '';
      this.user.jenis_kelamin = parsedUser.jenis_kelamin ?? '';
      this.user.nmr_telp = parsedUser.nmr_telp ?? '';
      this.user.pekerjaan = parsedUser.pekerjaan ?? '';
      this.user.pendidikan = parsedUser.pendidikan ?? '';
      this.user.tanggal_lahir = parsedUser.tanggal_lahir ?? '';
    }
  },
  methods: {
    saveData() {
      console.log("Data saved:", this.apiData);
      // Add logic to save data, for example, a POST request to the server.
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
.card {
  margin: 20px;
  padding: 20px;
}
.card-header {
  background-color: #f8f9fa;
}
</style>

<style scoped>
.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
</style>
