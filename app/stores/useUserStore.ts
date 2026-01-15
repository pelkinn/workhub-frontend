import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { UserProfile } from "~/types/auth";

export const useUserStore = defineStore("user", () => {
  const user = ref<UserProfile | null>(null);
  const isAuthenticated = ref(false);
  const token = useCookie("accessToken");

  const isLoggedIn = computed(() => token.value);

  function setUser(newUser: UserProfile | null) {
    user.value = newUser;
    isAuthenticated.value = !!newUser;
  }

  async function login(email: string, password: string) {
    const { auth } = useServices();
    const result = await auth.login({ email, password });

    if ("accessToken" in result) {
      user.value = result.user;
      isAuthenticated.value = true;
      token.value = result.accessToken;
    }

    return result;
  }

  async function register(
    email: string,
    password: string,
    name?: string | null
  ) {
    const { auth } = useServices();
    const result = await auth.register({ email, password, name });

    return result;
  }

  async function fetchUser() {
    try {
      const { auth } = useServices();
      const userData = await auth.me();
      setUser(userData);
      return userData;
    } catch (error) {
      logout();
      throw error;
    }
  }

  function logout() {
    setUser(null);
    token.value = null;
  }

  return {
    user,
    isAuthenticated,
    isLoggedIn,
    setUser,
    login,
    register,
    fetchUser,
    logout,
  };
});
