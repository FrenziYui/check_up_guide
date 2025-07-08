import axios from "axios";
const { BASE_URL2 } = useConstants();

export default defineNuxtPlugin((nuxtApp) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL2,
    timeout: 50000,
  });

  nuxtApp.provide("axios2", axiosInstance);
});
