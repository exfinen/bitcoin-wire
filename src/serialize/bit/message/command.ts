import { Parser } from "../../parser"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as util from "../../util"

export class Command extends Parser {
  name: string

  constructor(name: string) {
    super()
    if (name.length === 0 || name.length > 11) {
      throw new Error(`name is empty or more than 11-char long: '${name}' of length ${name.length}`)
    }
    this.name = name
  }

  toBuffer(): ArrayBuffer {
    // buf should contain 0-padded string
    const buf = new ArrayBuffer(12) // ArrayBuffer is 0-filled
    const ua = new Uint8Array(buf)
    ua.set(Buffer.from(this.name))
    return buf
  }

  static parse(st: ArrayBufferStream): Command | undefined {
    return util.tryParse("Command", () => {
      const buf = st.take(12)
      if (!buf) {
        return undefined
      }
      const name = util.arrayBuffer2Str(buf)
      return new Command(name)
    })
  }
}