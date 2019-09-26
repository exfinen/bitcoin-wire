import { Parser } from "../../parser"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as util from "../../util"

export class Nonce extends Parser {
  ua: Uint8Array

  constructor(ab: ArrayBuffer) {
    super()
    this.ua = new Uint8Array(ab)
    if (this.ua.length !== 8) {
      throw new Error(`Unexpected nonce size: ${this.ua.length}`)
    }
  }

  toBuffer(): ArrayBuffer {
    return this.ua.buffer
  }

  static parse(st: ArrayBufferStream): Nonce | undefined {
    return util.tryParse("Nonce", () => {
      const buf = st.take(8)
      if (!buf) {
        return undefined
      }
      return new Nonce(buf)
    })
  }
}