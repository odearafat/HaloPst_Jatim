import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Home/HomeView.vue";
import ChatbotView from "../views/ChatbotView.vue";
import KonsultasiView from "../views/LandingPages/Konsultasi/KonsultasiView.vue";
import LoginView from "../views/LandingPages/SignIn/LoginView.vue";
import ProfileView from "../views/LandingPages/Setting/ProfileView.vue";
import CerdProfile from "../views/LandingPages/Setting/component/CardProfil.vue";
import CardBooking from "../views/LandingPages/Setting/component/CardBooking.vue";
import CardHistory from "../views/LandingPages/Setting/component/CardHistory.vue";
import CardDetailBooking from "../views/LandingPages/Setting/component/CardDetailBooking.vue";
import CardDetailHistory from "../views/LandingPages/Setting/component/CardDetailHistory.vue";
import CardNotif from "../views/LandingPages/Setting/component/CardNotif.vue";
import SearchView from "../views/LandingPages/Search/SearchView.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "presentation",
      component: HomeView,
    },
    {
      path: "/aida",
      name: "aida",
      component: ChatbotView,
    },
    {
      path: "/konsultasi",
      name: "konsultasi",
      component: KonsultasiView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/settings",
      name: "ProfileView",
      component: ProfileView,
      children: [
        {
          path: "profil",
          name: "CardProfil",
          component: CerdProfile,
        },
        {
          path: "booking",
          name: "CardBooking",
          component: CardBooking,
        },
        {
          path: "history",
          name: "CardHistory",
          component: CardHistory,
        },
        {
          path: "booking/:id", // Parameter dinamis untuk id reservasi
          name: "CardDetailBooking", // Nama rute untuk CardDetailBooking
          component: CardDetailBooking, // Komponen CardDetailBooking yang akan ditampilkan
        },
        {
          path: "history/:id", // Parameter dinamis untuk id reservasi
          name: "CardDetailHistory", // Nama rute untuk CardDetailBooking
          component: CardDetailHistory, // Komponen CardDetailBooking yang akan ditampilkan
        },
        {
          path: "notif",
          name: "CardNotif",
          component: CardNotif,
        },
      ],
    },
    {
      path: "/search",
      name: "search",
      component: SearchView,
    },
  ],
});

export default router;
