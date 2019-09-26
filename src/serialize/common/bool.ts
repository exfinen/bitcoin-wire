import { Parser } from "../parser"
import { ArrayBufferStream } from "../arrayBufferStream"
import * as util from "../util"

export class Bool extends Parser {
  b: boolean

  constructor(b: boolean) {
    super()
    this.b = b
  }

  toBuffer(): ArrayBuffer {
    const buf = new ArrayBuffer(1)
    const dv = new DataView(buf)
    dv.setUint8(0, this.b ? 1 : 0)
    return buf
  }

  static parse(st: ArrayBufferStream): Bool | undefined {
    return util.tryParse("Bool", () => {
      const buf = st.take(1)
      if (!buf) {
        return undefined
      }
      const dv = new DataView(buf)
      const b = dv.getInt8(0)
      return new Bool(b === 1)
    })
  }
}