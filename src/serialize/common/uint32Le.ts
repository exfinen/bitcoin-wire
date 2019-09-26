import { Parser } from "../parser"
import { ArrayBufferStream } from "../arrayBufferStream"
import * as util from "../util"

export class Uint32Le extends Parser {
  n: number

  constructor(n: number) {
    super()
    this.n = n
  }

  // unsigned
  un(): number {
    return this.n >>> 0
  }

  toBuffer(): ArrayBuffer {
    const buf = new ArrayBuffer(4)
    const dv = new DataView(buf)
    dv.setUint32(0, this.n, true)
    return buf
  }

  toJSON(): string {
    return this.n.toString()
  }

  static parse(st: ArrayBufferStream): Uint32Le | undefined {
    return util.tryParse("Uint32Le", () => {
      const buf = st.take(4)
      if (!buf) {
        return undefined
      }
      const dv = new DataView(buf)
      const n = dv.getUint32(0, true)
      return new Uint32Le(n)
    })
  }
}
