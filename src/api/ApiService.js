import apiClient from './ApiConfig';

export const apiService = {
  addUser(data) {
    return apiClient.post('pengguna/', data);
  },

  updateUser(id, data) {
    return apiClient.put(`pengguna/${id}`, data);
  },

  addConsultation(data) {
    return apiClient.post('konsultasi/', data);
  },

  getConsultationsByUser(idPengguna) {
    return apiClient.get(`konsultasi-by-pengguna/${idPengguna}`);
  },

  getReservationsByUser(idPengguna) {
    return apiClient.get(`reservasi-by-pengguna/${idPengguna}`);
  },

  getHistoryByUser(idPengguna) {
    return apiClient.get(`histori-by-pengguna/${idPengguna}`);
  },

  getConsultation(idKonsultasi) {
    return apiClient.get(`konsultasi/${idKonsultasi}`);
  },

  cancelConsultation(idKonsultasi, data) {
    return apiClient.put(`konsultasi/${idKonsultasi}/batal`, data);
  },

  giveFeedback(idKonsultasi, data) {
    return apiClient.put(`konsultasi/${idKonsultasi}/feedback`, data);
  },

  getAllOfficers() {
    return apiClient.get('petugas');
  },

  getOfficersBySatker(idSatker) {
    return apiClient.get(`petugas-by-satker/${idSatker}`);
  },

  getOfficer(idPetugas) {
    return apiClient.get(`petugas/${idPetugas}`);
  },

  getAllKabupaten() {
    return apiClient.get('kabupaten');
  },

  getKabupatenByProvinsi(idProv) {
    return apiClient.get(`kabupaten-by-prov/${idProv}`);
  },

  getAllProvinces() {
    return apiClient.get('provinsi');
  },

  getAllUsers() {
    return apiClient.get('pengguna');
  },

  getUser(idPengguna) {
    return apiClient.get(`pengguna/${idPengguna}`);
  },

  getAllConsultations() {
    return apiClient.get('konsultasi');
  },

  getAllSatker() {
    return apiClient.get('satker');
  }
};
