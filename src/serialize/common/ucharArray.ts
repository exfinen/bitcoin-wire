import { Parser } from "../parser"
import { ArrayBufferStream } from "../arrayBufferStream"
import * as Util from "../util"

export class UcharArray extends Parser {
  readonly ab: ArrayBuffer
  static readonly empty = new UcharArray(new ArrayBuffer(0))

  constructor(ab: ArrayBuffer) {
    super()
    this.ab = ab

  }

  toBuffer(): ArrayBuffer {
    return this.ab
  }

  toJSON(): string {
    return Util.arrayBuffer2Buffer(this.ab).toString("hex")
  }

  static parse(st: ArrayBufferStream, size: number): UcharArray | undefined {
    return Util.tryParse(`UcharArray(${size})`, () => {
      const buf = st.take(size)
      if (!buf) {
        return undefined
      }
      return new UcharArray(buf)
    })
  }

  static fromStr(s: string): UcharArray {
    return new UcharArray(Buffer.from(s))
  }
}
