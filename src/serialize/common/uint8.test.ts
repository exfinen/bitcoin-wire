import { Uint8 } from "./uint8"
import { ArrayBufferStream } from "../arrayBufferStream"

test("buffer to X to buffer", () => {
})

test("from buffer", () => {
  const buf = new ArrayBuffer(1)
  const dv = new DataView(buf)
  dv.setUint8(0, 123)
  const x = Uint8.parse(new ArrayBufferStream(buf))
  expect(x).toBeDefined()
  expect(x.n).toBe(123)
})

test("to buffer", () => {
  const x = new Uint8(123)
  const buf = x.toBuffer()
  const dv = new DataView(buf)
  const n = dv.getUint8(0)
  expect(n).toBe(123)
})