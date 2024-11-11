import { UserAuth } from "@/types/UserAuth";

export const getUserData = () => {
  return JSON.parse(
    localStorage.getItem("pocketbase_auth") as string
  ) as UserAuth;
};
