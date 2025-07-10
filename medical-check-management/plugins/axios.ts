import axios from "axios";
const { BASE_URL } = useConstants();

export default defineNuxtPlugin((nuxtApp) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 50000,
  });

  nuxtApp.provide("axios", axiosInstance);
});
