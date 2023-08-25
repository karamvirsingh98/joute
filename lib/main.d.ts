interface RegisteredJwsClaims {
    iss: string;
    sub: string;
    aud: string | string[];
    exp: number;
    nbf: number;
    iat: number;
    jti: number;
}
type JwsConfig = Array<keyof RegisteredJwsClaims>;
type RequiredConfigs<T extends JwsConfig> = {
    [K in T[number]]: K extends keyof RegisteredJwsClaims ? RegisteredJwsClaims[K] : never;
};
export default class Joute<T extends Record<string, any>, C extends JwsConfig = []> {
    secret: string;
    constructor(secret: string);
    issue: (input?: T & RequiredConfigs<C>) => Promise<string>;
    verify: (token: string) => Promise<T & RequiredConfigs<C>>;
    private hash;
}
export {};
