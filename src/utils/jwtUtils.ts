import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/constants/storage";
import { Agent, User } from "@/types/auth";

interface JWTPayload {
  user: User;
  agent: Agent;
  sub: string;
  iat: number;
  exp: number;
}

export const getDecodedToken = async (): Promise<JWTPayload | null> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) return null;
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getUserKey = async (): Promise<string | null> => {
  const decoded = await getDecodedToken();
  const id = decoded?.user?.id;
  return id !== undefined && id !== null ? String(id) : null;
};

export const getAgentKey = async (): Promise<string | null> => {
  const decoded = await getDecodedToken();
  const id = decoded?.agent?.id;
  return id !== undefined && id !== null ? String(id) : null;
};

// export const getRegionKey = async (): Promise<string | null> => {
//   const decoded = await getDecodedToken();
//   return decoded?.user?.regionKey || null;
// };

export const isTokenExpired = async (): Promise<boolean> => {
  const decoded = await getDecodedToken();
  if (!decoded) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp <= currentTime + 30;
};
