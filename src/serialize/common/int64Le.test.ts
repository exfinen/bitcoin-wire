import { Int64Le } from "./int64Le"
import { ArrayBufferStream } from "../arrayBufferStream"

test("buffer to X to buffer", () => {
})

describe("from buffer", () => {
    test("should handle  0x100000000", () => {
      const buf = new ArrayBuffer(8)
      const dv = new DataView(buf)
      dv.setBigInt64(0, BigInt("0x100000000"), true)
      const x = Int64Le.parse(new ArrayBufferStream(buf))
      expect(x).toBeDefined()
      expect(x.n).toBe(BigInt("0x100000000"))
    })
})

describe("to buffer", () => {
    test("should handle 0x100000000", () => {
      const x = new Int64Le(BigInt("0x100000000"))
      const buf = x.toBuffer()
      const dv = new DataView(buf)
      const n = dv.getBigInt64(0, true)
      expect(n).toBe(BigInt("0x100000000"))
    })
})