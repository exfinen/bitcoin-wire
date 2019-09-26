import { Parser } from "../parser"
import { ArrayBufferStream } from "../arrayBufferStream"
import * as util from "../util"

export class Uint8 extends Parser {
  n: number
  readonly size: number = 1
  static readonly zero = new Uint8(0)

  constructor(n: number) {
    super()
    this.n = n
  }

  toBuffer(): ArrayBuffer {
    const buf = new ArrayBuffer(1)
    const dv = new DataView(buf)
    dv.setUint8(0, this.n)
    return buf
  }

  toJSON(): string {
    return this.n.toString()
  }

  static parse(st: ArrayBufferStream): Uint8 | undefined {
    return util.tryParse("Uint8", () => {
      const buf = st.take(1)
      if (!buf) {
        return undefined
      }
      const dv = new DataView(buf)
      const n = dv.getUint8(0)
      return new Uint8(n)
    })
  }
}
