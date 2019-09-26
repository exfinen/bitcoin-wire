import { Parser } from "../parser"
import { ArrayBufferStream } from "../arrayBufferStream"
import { tryParse } from "../util"

/*
< 0xFD         1	uint8_t
<= 0xFFFF      3	0xFD followed by the length as uint16_t
<= 0xFFFF FFFF 5	0xFE followed by the length as uint32_t
-              9	0xFF followed by the length as uint64_t
*/
export class VarInt extends Parser {
  n: number | bigint

  constructor(n: number | bigint) {
    super()
    this.n = n
  }

  getSize(): number {
    if (this.n < 0xfd) { return 1 }
    if (this.n <= 0xffff) { return 3 }
    if (this.n <= 0xffffffff) { return 5 }
    return 9
  }

  toBuffer(): ArrayBuffer {
    const size = this.getSize()
    const buf = new ArrayBuffer(size)
    const dv = new DataView(buf)

    switch(size) {
      case 1:
        dv.setUint8(0, this.n as number)
        break
      case 3:
        dv.setUint8(0, 0xfd)
        dv.setUint16(1, this.n as number, true)
        break
      case 5:
        dv.setUint8(0, 0xfe)
        dv.setUint32(1, this.n as number, true)
        break
      default:
        dv.setUint8(0, 0xff)
        dv.setBigUint64(1, this.n as bigint, true)
        break
    }
    return buf
  }

  toJSON(): string {
    return this.n.toString()
  }

  private static build(st: ArrayBufferStream, size: number) : VarInt | undefined {
    const buf = st.take(size)
    if (!buf) {
      return undefined
    }
    const dv = new DataView(buf)
    let n: number | bigint
    if (size === 2) {
      n = dv.getUint16(0, true)
    } else if (size === 4) {
      n = dv.getUint32(0, true)
    } else {
      n = dv.getBigUint64(0, true)
    }
    return new VarInt(n)
  }

  static parse(st: ArrayBufferStream): VarInt | undefined {
    return tryParse("VarInt", () => {
      const b1 = st.take(1)
      if (!b1) {
        return undefined
      }
      const dv1 = new DataView(b1)
      const n1 = dv1.getUint8(0)

      if (n1 < 0xfd) {
        return new VarInt(n1)
      }
      if (n1 === 0xfd) {
        return VarInt.build(st, 2)

      } else if (n1 === 0xfe) {
        return VarInt.build(st, 4)

      } else if (n1 === 0xff) {
        return VarInt.build(st, 8)

      } else {
        throw new Error(`Unexpected 1st byte ${n1} in VarInt`)
      }
    })
  }
}
