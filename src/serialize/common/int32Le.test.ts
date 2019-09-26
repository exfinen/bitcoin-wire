import { Int32Le } from "./int32Le"
import { ArrayBufferStream } from "../arrayBufferStream"

test("buffer to X to buffer", () => {
})

describe("from buffer", () => {
    test("should handle 12345", () => {
      const buf = new ArrayBuffer(4)
      const dv = new DataView(buf)
      dv.setInt32(0, 12345, true)
      const x = Int32Le.parse(new ArrayBufferStream(buf))
      expect(x).toBeDefined()
      expect(x.n).toBe(12345)
    })
})

describe("to buffer", () => {
    test("should handle 12345", () => {
      const x = new Int32Le(12345)
      const buf = x.toBuffer()
      const dv = new DataView(buf)
      const n = dv.getInt32(0, true)
      expect(n).toBe(12345)
    })
})