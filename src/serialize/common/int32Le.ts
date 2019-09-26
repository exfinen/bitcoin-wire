import { Parser } from "../parser"
import { ArrayBufferStream } from "../arrayBufferStream"
import * as util from "../util"

export class Int32Le extends Parser {
  n: number

  constructor(n: number) {
    super()
    this.n = n
  }

  toBuffer(): ArrayBuffer {
    const buf = new ArrayBuffer(4)
    const dv = new DataView(buf)
    dv.setInt32(0, this.n, true)
    return buf
  }

  toJSON(): string {
    return this.n.toString()
  }

  static parse(st: ArrayBufferStream): Int32Le | undefined {
    return util.tryParse("Int32Le", () => {
      const buf = st.take(4)
      if (!buf) {
        return undefined
      }
      const dv = new DataView(buf)
      const n = dv.getInt32(0, true)
      return new Int32Le(n)
    })
  }
}