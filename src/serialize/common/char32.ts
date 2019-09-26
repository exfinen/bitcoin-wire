import { Parser } from "../parser"
import { ArrayBufferStream } from "../arrayBufferStream"
import * as Util from "../util"

export class Char32 extends Parser {
  ua: Uint8Array
  reversed: boolean
  static readonly zero = new Char32(new Uint8Array(32) /* zero-filled */, false)

  constructor(ua: Uint8Array, reversed: boolean = false) {
    super()
    this.reversed = reversed
    if (ua.length !== 32) {
      throw new Error(`Expected input array length to be 32, but got: ${ua.length}`)
    }
    this.ua = ua
  }

  toBuffer(): ArrayBuffer {
    if (this.reversed) {
      return Util.reverseArrayBuffer(this.ua)
    } else {
      return this.ua.buffer
    }
  }

  toJSON(): string {
    return Util.arrayBuffer2Buffer(this.ua.buffer).toString("hex")
  }

  static parse(st: ArrayBufferStream, reverse: boolean = false): Char32 | undefined {
    return Util.tryParse("char32", () => {
      let buf = st.take(32)
      if (!buf) {
        return undefined
      }
      if (reverse) {
        buf = Util.reverseArrayBuffer(buf)
      }
      return new Char32(new Uint8Array(buf), reverse)
    })
  }
}