import { base } from "../__core/app";

export const ping = base.handler(() => ({ message: `Pong! ${Date.now()}` }));
