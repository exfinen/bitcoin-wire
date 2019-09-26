import { Payload } from "../message/payload"
import { Parser } from "../../parser"
import { Nonce } from "../version/nonce"
import { ArrayBufferStream } from "../../arrayBufferStream"

export class Ping extends Parser implements Payload {
  nonce: Nonce

  constructor(nonce: Nonce) {
    super()
    this.nonce = nonce
  }

  toBuffer(): ArrayBuffer {
    return this.nonce.toBuffer()
  }

  static parse(st: ArrayBufferStream): Ping | undefined {
    const nonce = Nonce.parse(st)
    if (!nonce) {
      return undefined
    }
    return new Ping(nonce)
  }

  getName(): string {
    return "ping"
  }

  getBuffer(): ArrayBuffer {
    return this.toBuffer()
  }
}