"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Joute {
    secret;
    constructor(secret) {
        this.secret = secret;
    }
    issue = async (input) => {
        const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
        const h = Buffer.from(header).toString("base64url");
        const payload = JSON.stringify(input ?? {});
        const p = Buffer.from(payload).toString("base64url");
        const signature = await this.hash(`${h}.${p}`);
        const s = Buffer.from(signature).toString("base64url");
        return `${h}.${p}.${s}`;
    };
    verify = async (token) => {
        const [h, p, s] = token.split(".");
        const compare = await this.hash(`${h}.${p}`);
        if (Buffer.from(compare).toString("base64") === s) {
            const parsed = Buffer.from(p, "base64url").toString();
            return JSON.parse(parsed);
        }
        else
            throw new Error("failed to verify jwt");
    };
    hash = async (input) => await crypto.subtle.sign("HMAC", await crypto.subtle.importKey("raw", new TextEncoder().encode(this.secret), { name: "HMAC", hash: "SHA-256" }, true, ["sign"]), new TextEncoder().encode(input));
}
exports.default = Joute;
