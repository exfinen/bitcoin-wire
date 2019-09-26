import { Parser } from "../../parser"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as util from "../../util"

export class Checksum extends Parser {
  v: ArrayBuffer

  constructor(v: ArrayBuffer) {
    super()
    const length = new Uint8Array(v).length
    if (length !== 4) {
      throw new Error(`Malformed checksum of length: ${length}`)
    }
    this.v = v
  }

  toBuffer(): ArrayBuffer {
    return this.v
  }

  static parse(st: ArrayBufferStream): Checksum | undefined {
    return util.tryParse("Checksum", () => {
      const buf = st.take(4)
      if (!buf) {
        return undefined
      }
      return new Checksum(buf)
    })
  }
}
