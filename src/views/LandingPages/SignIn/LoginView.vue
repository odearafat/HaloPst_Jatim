<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { decodeCredential, googleLogout, GoogleLogin } from "vue3-google-login";
import { apiService } from "@/api/ApiService.js";
import NavbarLogin from "@/examples/navbars/NavbarLogin.vue";
import Header from "@/examples/Header.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialSwitch from "@/components/MaterialSwitch.vue";
import setMaterialInput from "@/assets/js/material-input.js";
import bg0 from "@/assets/img/bg9.jpg";

const user = reactive({
  name: "",
  email: "",
  picture: "",
  id: "",
  given_name: "",
  family_name: "",
  email_google: "",
  nama_pengguna: "",
  foto: "",
  password: "",
});

const loggedIn = ref(false);
const loading = ref(false);
const router = useRouter();

const callback = async (response) => {
  loading.value = true;
  try {
    const decoded = decodeCredential(response.credential);
    user.name = decoded.name ?? "-";
    user.email = decoded.email ?? "-";
    user.picture = decoded.picture ?? "-";
    user.id = decoded.sub;
    user.given_name = decoded.given_name ?? "-";
    user.family_name = decoded.family_name ?? "-";
    loggedIn.value = true;

    const id_token = response.credential;
    const userData = {
      email_google: user.email,
      nama_pengguna: user.name,
      family_name: user.family_name,
      given_name: user.given_name,
      foto: user.picture,
    };

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("id_token", id_token);
    console.log("ID_TOKEN"+id_token)
    await verifyToken(id_token);
    const apiResponse = await apiService.addUser(userData);

    if (apiResponse && apiResponse.status == 200) {
      localStorage.setItem("user", JSON.stringify(apiResponse.data.data));
      router.push({ name: "CardProfil" }).then(() => {
        this.$router.go(0);
      });
    } else {
      console.error("API failed:", apiResponse);
    }
  } catch (error) {
    handleError(error);
  } finally {
    loading.value = false;
  }
};

const verifyToken = async (token) => {
  try {
    // const res = await fetch("https://halopst.web.bps.go.id/backend/api/verify-google-token", {
    const res = await fetch("http://localhost:8000/api/verify-google-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();
    console.log("Backend response:", data);

    if (res.ok) {
      localStorage.setItem("token", data.token);
      console.log("Google login successful");
      console.log("TOKEN"+data.token)
    } else {
      console.error("Verification failed:", data.error);
    }
  } catch (error) {
    console.error("Error during verification:", error);
  }
};

const handleError = (error) => {
  if (error.response) {
    console.error("API request failed with response:", error.response.data);
    console.error("Status code:", error.response.status);
    console.error("Headers:", error.response.headers);
  } else if (error.request) {
    console.error("API request sent but no response received:", error.request);
  } else {
    console.error("Error setting up API request:", error.message);
  }
  console.error("Error config:", error.config);
};


const logout = () => {
  googleLogout();
  Object.keys(user).forEach(key => user[key] = "");
  loggedIn.value = false;
  localStorage.removeItem("user");
  localStorage.setItem("loggedIn", "false");
};

onMounted(() => {
  setMaterialInput();
  const storedUser = localStorage.getItem("user");
  const storedLoggedIn = localStorage.getItem("loggedIn");

  if (storedUser && storedLoggedIn == "true") {
    const parsedUser = JSON.parse(storedUser);
    Object.assign(user, parsedUser);
    loggedIn.value = true;
  }
});
</script>

<template>
  <section>
    <NavbarLogin />
    <Header>
      <div
        class="page-header align-items-start min-vh-100"
        :style="{ backgroundImage: `url(${bg0})` }"
        loading="lazy"
      >
        <span class="mask bg-gradient-dark opacity-6"></span>
        <div class="container my-auto">
          <div class="row">
            <div class="col-lg-4 col-md-8 col-12 mx-auto">
              <div class="card z-index-0 fadeIn3 fadeInBottom">
                <div
                  class="card-header p-0 position-relative mt-n4 mx-3 z-index-2"
                >
                  <div
                    class="bg-gradient-success shadow-success border-radius-lg py-3 pe-1"
                  >
                    <h4
                      class="text-white font-weight-bolder text-center mt-2 mb-0"
                    >
                      <span class="font-weight-normal"><i>Login </i></span>
                      HaloPST
                    </h4>
                  </div>
                </div>
                <div class="card-body">
                  <form role="form" class="text-start" @submit.prevent="login">
                    <MaterialInput
                      id="email"
                      class="input-group-outline my-3"
                      :label="{ text: 'Email', class: 'form-label' }"
                      type="email"
                      v-model="user.email"
                    />
                    <MaterialInput
                      id="password"
                      class="input-group-outline mb-3"
                      :label="{ text: 'Password', class: 'form-label' }"
                      type="password"
                      v-model="user.password"
                    />
                    <MaterialSwitch
                      class="d-flex align-items-center mb-3"
                      id="rememberMe"
                      labelClass="mb-0 ms-3"
                      checked
                    >Ingat saya</MaterialSwitch>

                    <div class="text-center">
                      <MaterialButton
                        class="my-4 mb-2"
                        variant="gradient"
                        color="success"
                        fullWidth
                      >Log in</MaterialButton>
                    </div>
                    <p class="mt-4 text-sm text-center">Tidak memiliki akun?</p>
                    <div class="row">
                      <div class="col-12 text-center">
                        <div
                          class="d-flex gap-3 flex-column mt-3 align-items-center"
                        >
                          <GoogleLogin
                            :callback="callback"
                            prompt
                            auto-login
                            class="align-self-md-center shadow"
                            id="btn_google"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Header>

    <!-- Loading Modal -->
    <div v-if="loading" class="modal-backdrop">
      <div class="modal position-static d-block">
        <div class="modal-dialog" role="document">
          <div class="modal-content rounded-4 shadow">
            <div class="modal-body py-5">
              <div class="d-flex justify-content-center align-items-center">
                <div class="spinner-border text-success" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <span class="ms-3">Loading</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
