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
  [K in T[number]]: K extends keyof RegisteredJwsClaims
    ? RegisteredJwsClaims[K]
    : never;
};

export default class Joute<
  T extends Record<string, any>,
  C extends JwsConfig = []
> {
  secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  issue = async (input?: T & RequiredConfigs<C>) => {
    const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
    const h = Buffer.from(header).toString("base64url");

    const payload = JSON.stringify(input ?? {});
    const p = Buffer.from(payload).toString("base64url");

    const signature = await this.hash(`${h}.${p}`);
    const s = Buffer.from(signature).toString("base64url");

    return `${h}.${p}.${s}`;
  };

  verify = async (token: string) => {
    const [h, p, s] = token.split(".");
    const compare = await this.hash(`${h}.${p}`);
    if (Buffer.from(compare).toString("base64") === s) {
      const parsed = Buffer.from(p, "base64url").toString();
      return JSON.parse(parsed) as T & RequiredConfigs<C>;
    } else throw new Error("failed to verify jwt");
  };

  private hash = async (input: string) =>
    await crypto.subtle.sign(
      "HMAC",
      await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(this.secret),
        { name: "HMAC", hash: "SHA-256" },
        true,
        ["sign"]
      ),
      new TextEncoder().encode(input)
    );
}
