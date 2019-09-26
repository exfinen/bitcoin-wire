import { Parser } from "../../parser"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as util from "../../util"

// doesn't support IPv6
export class IpV6_4 extends Parser {
  octets: number[]

  constructor(octets: number[]) {
    super()
    if (octets.length !== 4) {
      throw new Error(`Malformed octets: ${octets}`)
    }
    this.octets = octets
  }

  toBuffer(): ArrayBuffer {
    const buf = new ArrayBuffer(16)
    const ua = new Uint8Array(buf)
    ua.set([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xff, 0xff], 0)
    ua.set(this.octets, 12)
    return buf
  }

  static parse(st: ArrayBufferStream): IpV6_4 | undefined {
    return util.tryParse("IpV6_4", () => {
      const buf = st.take(16)
      if (!buf) {
        return undefined
      }
      const ua = new Uint8Array(buf)
      const octets = [
        ua[12],
        ua[13],
        ua[14],
        ua[15],
      ]
      return new IpV6_4(octets)
    })
  }
}