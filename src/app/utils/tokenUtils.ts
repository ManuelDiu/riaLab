

const DEFAULT_TOKEN_NAME = "tokenInfo";

export const storageToken = (token: string) => {
    sessionStorage.setItem(DEFAULT_TOKEN_NAME, token);
}

export const getToken = () => {
   return sessionStorage.getItem(DEFAULT_TOKEN_NAME);
}

export const clearToken = () => {
    sessionStorage.removeItem(DEFAULT_TOKEN_NAME);
}
