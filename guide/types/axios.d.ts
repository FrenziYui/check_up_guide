import { AxiosInstance } from "axios";

declare module "#app" {
  interface NuxtApp {
    $axios: AxiosInstance;
    $axios2: AxiosInstance;
  }
}
