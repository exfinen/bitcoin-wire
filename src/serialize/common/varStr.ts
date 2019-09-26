import { Parser } from "../parser"
import { VarInt } from "./varInt"
import * as util from "../util"
import { ArrayBufferStream } from "../arrayBufferStream"

/*
1+	length	var_int	Length of the string
?	string	char[]	The string itself (can be empty)
*/
export class VarStr extends Parser {
  s: string

  constructor(s: string) {
    super()
    this.s = s
  }

  toBuffer(): ArrayBuffer {
    const vi = new VarInt(this.s.length)
    const buf = new ArrayBuffer(vi.getSize() + this.s.length)

    const uaBuf = new Uint8Array(buf)
    const uaVi = new Uint8Array(vi.toBuffer())
    uaBuf.set(uaVi, 0)
    uaBuf.set(Buffer.from(this.s), uaVi.length)

    return buf
  }

  static parse(st: ArrayBufferStream): VarStr | undefined {
    return util.tryParse("VarStr", () => {
      const vi = VarInt.parse(st)
      if (!vi) {
        return undefined
      }
      const strLen = vi.n as number
      const buf = st.take(strLen)
      const str = util.arrayBuffer2Str(buf)
      return new VarStr(str)
    })
  }
}