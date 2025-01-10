import Cookies from "js-cookie";
type CookieSchema = userCookieSchema

interface userCookieSchema {
    provider: "Local" | "Google";
    token: string;
}

export const setCookie = (cookieData: CookieSchema, key: string) => {
    Cookies.set(key, JSON.stringify(cookieData), { expires: 1, path: '/' });
}

export const getCookieData = (key: string): CookieSchema | null => {
    const cookie = Cookies.get(key);
    return cookie ? JSON.parse(cookie) as CookieSchema : null;
}