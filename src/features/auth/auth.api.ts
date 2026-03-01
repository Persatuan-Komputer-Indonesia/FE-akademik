import api from "@/lib/api";

export const authAPI = {
  registerRequest: (data: {
    username: string;
    email: string;
    password: string;
  }) =>
    api.post("/register/request", data),

  registerVerify: (data: {
    email: string;
    otp: string;
  }) =>
    api.post("/register/verify", data),

  forgotRequest: (email: string) =>
    api.post("/forgot-password/request", { email }),

  forgotVerify: (data: {
    email: string;
    otp: string;
  }) =>
    api.post("/forgot-password/verify", data),

    forgotReset : (data: {
      email: string;
      newPassword: string;
    }) =>
      api.post("/forgot-password/reset", data),
};