import { create } from "zustand";

interface AuthStoreState {
  isLoadingOauthGoogle: boolean;
  isLoadingOauthApple: boolean;
  setIsLoadingOauthGoogle: (isLoading: boolean) => void;
  setIsLoadingOauthApple: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  isLoadingOauthGoogle: false,
  isLoadingOauthApple: false,
  setIsLoadingOauthGoogle: (isLoading) =>
    set({ isLoadingOauthGoogle: isLoading }),
  setIsLoadingOauthApple: (isLoading) =>
    set({ isLoadingOauthApple: isLoading }),
}));
