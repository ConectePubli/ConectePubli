import { useAuthStore } from "@/store/useAuthStore";
import pb, { PocketBaseError } from "./pb";

export async function getUserType() {
  const refreshed = await refreshToken();
  if (!refreshed) {
    return null;
  }
  return pb.authStore.model?.collectionName || null;
}

export async function refreshToken() {
  if (!pb.authStore.isValid) {
    pb.rememberPath();
    return false;
  }

  const collectionName = pb.authStore.model?.collectionName;

  if (!collectionName) {
    pb.logout();
    return false;
  }

  try {
    await pb.collection(collectionName).authRefresh();
    return true;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error("Failed to refresh token:", err.data);
    if (err.data.code === 401) {
      pb.logout();
    }
    return false;
  }
}

export async function signOut() {
  pb.logout();
}

export async function loginWithEmailBrand(email: string, password: string) {
  try {
    const authData = await pb
      .collection("Brands")
      .authWithPassword(email, password);
    return authData;
  } catch (err) {
    pb.handleError(err as PocketBaseError);
    throw err;
  }
}

export async function loginWithEmailInfluencer(
  email: string,
  password: string
) {
  try {
    const authData = await pb
      .collection("Influencers")
      .authWithPassword(email, password);
    return authData;
  } catch (err) {
    pb.handleError(err as PocketBaseError);
    throw err;
  }
}

export async function loginWithGoogleBrands() {
  const setIsLoadingOauthGoogle =
    useAuthStore.getState().setIsLoadingOauthGoogle;
  try {
    setIsLoadingOauthGoogle(true);
    const authData = await pb.collection("Brands").authWithOAuth2({
      provider: "google",
      urlCallback: (url) => {
        window.open(
          url + "&prompt=select_account",
          "_blank",
          "width=500,height=600,menubar=no,toolbar=no,scrollbars=yes"
        );
        setIsLoadingOauthGoogle(false);
      },
    });
    return authData;
  } catch (err) {
    pb.handleError(err as PocketBaseError);
    throw err;
  }
}

export async function loginWithGoogleInfluencers() {
  const setIsLoadingOauthGoogle =
    useAuthStore.getState().setIsLoadingOauthGoogle;
  try {
    setIsLoadingOauthGoogle(true);
    const authData = await pb.collection("Influencers").authWithOAuth2({
      provider: "google",
      urlCallback: (url) => {
        window.open(
          url + "&prompt=select_account",
          "_blank",
          "width=500,height=600,menubar=no,toolbar=no,scrollbars=yes"
        );
        setIsLoadingOauthGoogle(false);
      },
    });
    return authData;
  } catch (err) {
    pb.handleError(err as PocketBaseError);
    throw err;
  }
}

export async function loginWithAppleBrands() {
  const setIsLoadingOauthApple = useAuthStore.getState().setIsLoadingOauthApple;

  try {
    setIsLoadingOauthApple(true);
    const authData = await pb.collection("Brands").authWithOAuth2({
      provider: "apple",
      urlCallback: (url) => {
        window.open(url, "_blank", "menubar=no,toolbar=no,scrollbars=yes");
        setIsLoadingOauthApple(false);
      },
    });
    return authData;
  } catch (err) {
    pb.handleError(err as PocketBaseError);
    throw err;
  }
}

export async function loginWithAppleInfluencers() {
  const setIsLoadingOauthApple = useAuthStore.getState().setIsLoadingOauthApple;

  try {
    setIsLoadingOauthApple(true);
    const authData = await pb.collection("Influencers").authWithOAuth2({
      provider: "apple",
      urlCallback: (url) => {
        window.open(url, "_blank", "menubar=no,toolbar=no,scrollbars=yes");
        setIsLoadingOauthApple(false);
      },
    });
    return authData;
  } catch (err) {
    pb.handleError(err as PocketBaseError);
    throw err;
  }
}
