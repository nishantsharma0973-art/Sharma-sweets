import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

export const fetchProducts = (params = {}) =>
  api.get("/products", { params }).then((r) => r.data);
export const fetchCategories = () => api.get("/categories").then((r) => r.data);
export const fetchTestimonials = () => api.get("/testimonials").then((r) => r.data);
export const fetchConfig = () => api.get("/config").then((r) => r.data);

export const createOrder = (payload) => api.post("/orders", payload).then((r) => r.data);
export const verifyPayment = (payload) =>
  api.post("/orders/verify-payment", payload).then((r) => r.data);
export const subscribeNewsletter = (email) =>
  api.post("/newsletter", { email }).then((r) => r.data);
export const submitContact = (payload) =>
  api.post("/contact", payload).then((r) => r.data);
export const submitCatering = (payload) =>
  api.post("/catering", payload).then((r) => r.data);
export const addTestimonial = (payload) =>
  api.post("/testimonials", payload).then((r) => r.data);
