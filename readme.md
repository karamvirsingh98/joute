# Joute

A simple JWT issuer designed to run on `vercel`'s edge network.

The name is a pun on the french word 'joust', the fact that it sounds like a silly pronouncination of the vowel sounds j,w,t, and the fact that authentication is maybe like jousting somehow?

## Usage

install via `yarn add joute`, or `npm install joute`

code example:

```ts
import Joute from "joute";

const j = new Joute("<your-signing-secret>");

// issues a
const payload = {}; // could be anything, eg. { id: '<user-id>' }
const token = j.issue(payload);

const payload = j.verify(token);
```
