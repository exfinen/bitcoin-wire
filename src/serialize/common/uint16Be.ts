import { Parser } from "../parser"
import { ArrayBufferStream } from "../arrayBufferStream"
import * as util from "../util"

export class Uint16Be extends Parser {
  n: number

  constructor(n: number) {
    super()
    this.n = n
  }

  toBuffer(): ArrayBuffer {
    const buf = new ArrayBuffer(2)
    const dv = new DataView(buf)
    dv.setUint16(0, this.n, false)
    return buf
  }

  static parse(st: ArrayBufferStream): Uint16Be | undefined {
    return util.tryParse("Uint16Be", () => {
      const buf = st.take(2)
      if (!buf) {
        return undefined
      }
      const dv = new DataView(buf)
      const n = dv.getUint16(0, false)
      return new Uint16Be(n)
    })
  }
}