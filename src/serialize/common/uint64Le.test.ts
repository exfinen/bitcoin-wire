import { Uint64Le } from "./uint64Le"
import { ArrayBufferStream } from "../arrayBufferStream"
import { abEq } from "../util"

test("buffer to X to buffer", () => {
  const buf = new ArrayBuffer(8)
  const dv = new DataView(buf)
  dv.setBigUint64(0, BigInt("0x100000000"), true)
  const x = Uint64Le.parse(new ArrayBufferStream(buf))
  expect(abEq(x.toBuffer(), buf)).toBeTruthy()
})

describe("from buffer", () => {
  test("should handle  0x100000000", () => {
    const buf = new ArrayBuffer(8)
    const dv = new DataView(buf)
    dv.setBigUint64(0, BigInt("0x100000000"), true)
    const x = Uint64Le.parse(new ArrayBufferStream(buf))
    expect(x).toBeDefined()
    expect(x.n).toBe(BigInt("0x100000000"))
  })
})

describe("to buffer", () => {
  test("should handle 0x100000000", () => {
    const x = new Uint64Le(BigInt("0x100000000"))
    const buf = x.toBuffer()
    const dv = new DataView(buf)
    const n = dv.getBigUint64(0, true)
    expect(n).toBe(BigInt("0x100000000"))
  })
})