import { Payload } from "../message/payload"
import { Parser } from "../../parser"
import { Uint64Le } from "../../common/uint64Le"

import { ArrayBufferStream } from "../../arrayBufferStream"

export class Pong extends Parser implements Payload {
  nonce: Uint64Le

  constructor(nonce: Uint64Le) {
    super()
    this.nonce = nonce
  }

  toBuffer(): ArrayBuffer {
    return this.nonce.toBuffer()
  }

  static parse(st: ArrayBufferStream): Pong | undefined {
    const nonce = Uint64Le.parse(st)
    if (!nonce) {
      return undefined
    }
    return new Pong(nonce)
  }

  getName(): string {
    return "pong"
  }

  getBuffer(): ArrayBuffer {
    return this.toBuffer()
  }
}