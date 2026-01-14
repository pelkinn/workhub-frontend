import type { $Fetch } from "nitropack";
import type { RuntimeConfig } from "nuxt/schema";
import type { AuthResponse, Login, Register, UserProfile } from "@/types/auth";

export class AuthService {
  constructor(protected api: $Fetch, protected runtimeConfig: RuntimeConfig) {}

  async login(body: Login) {
    const result = await this.api<AuthResponse>(`/auth/login`, {
      method: "post",
      body,
    });

    if ("access_token" in result) {
      const { access_token: accessToken } = result;
      return { accessToken, user: result.user };
    }

    return result;
  }

  register(body: Register) {
    return this.api(`/auth/register`, {
      method: "post",
      body,
    });
  }

  me() {
    return this.api<UserProfile>(`/auth/me`);
  }
}
