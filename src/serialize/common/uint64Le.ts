import { Parser } from "../parser"
import { ArrayBufferStream } from "../arrayBufferStream"
import * as util from "../util"

export class Uint64Le extends Parser {
  n: bigint

  constructor(n: bigint) {
    super()
    this.n = n
  }

  toBuffer(): ArrayBuffer {
    const buf = new ArrayBuffer(8)
    const dv = new DataView(buf)
    dv.setBigUint64(0, this.n, true)
    return buf
  }

  static parse(st: ArrayBufferStream): Uint64Le | undefined {
    return util.tryParse("Uint64Le", () => {
      const buf = st.take(8)
      if (!buf) {
        return undefined
      }
      const dv = new DataView(buf)
      const n = dv.getBigUint64(0, true)
      return new Uint64Le(n)
    })
  }
}