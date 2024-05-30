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
            <h1 class="modal-title fs-5 fw-semibold text-danger">
              Ingin membatalkan Reservasi?
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="close"
            ><i class="bi bi-x"></i></button>
          </div>
          <div class="modal-body py-0">
            <p>
              Apakah Anda yakin ingin <strong>membatalkan reservasi</strong>  yang telah dibuat?
              Harap dicatat bahwa Anda mungkin harus mengatur ulang seluruh
              proses reservasi jika Anda memutuskan untuk membatalkan.
            </p>
          </div>
          <div class="modal-body py-0">
            <p>
              Harap berikan <strong>Alasan</strong> mengapa Anda ingin membatalkan reservasi Anda.
            </p>
            <textarea
              v-model="cancelReason"
              class="w-100 p-2"
              rows="4"
              placeholder="Harap isikan minimal 30 Kata.."
            ></textarea>
          </div>
          <div
            class="modal-footer flex-column align-items-stretch w-100 gap-2 pb-3 border-top-0"
          >
            <button
              type="button"
              class="btn btn-outline-danger"
              @click="cancelReservation"
            >
              Batalkan Reservasi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  data() {
    return {
      cancelReason: "",
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    cancelReservation() {
      // Send the cancelReason to the API
      // ...

      // Close the modal
      this.close();
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
</style>