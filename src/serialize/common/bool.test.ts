import { Bool } from "./bool"
import { ArrayBufferStream } from "../arrayBufferStream"

test("buffer to X to buffer", () => {
})

describe("from buffer", () => {
  test("should handle true", () => {
    const buf = new ArrayBuffer(1)
    const dv = new DataView(buf)
    dv.setInt8(0, 1)
    const x = Bool.parse(new ArrayBufferStream(buf))
    expect(x).toBeDefined()
    expect(x.b).toBeTruthy()
  })

  test("should handle false", () => {
    const buf = new ArrayBuffer(1)
    const dv = new DataView(buf)
    dv.setInt8(0, 0)
    const x = Bool.parse(new ArrayBufferStream(buf))
    expect(x).toBeDefined()
    expect(x.b).toBeFalsy()
  })
})

describe("to buffer", () => {
  test("should handle true", () => {
    const x = new Bool(true)
    const buf = x.toBuffer()
    const dv = new DataView(buf)
    const b = dv.getInt8(0)
    expect(b).toBe(1)
  })

  it("should handle fals3", () => {
    const x = new Bool(false)
    const buf = x.toBuffer()
    const dv = new DataView(buf)
    const b = dv.getInt8(0)
    expect(b).toBe(0)
  })
})