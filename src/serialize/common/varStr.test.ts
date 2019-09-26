import { VarStr } from "./varStr"
import { ArrayBufferStream } from "../arrayBufferStream"
import { abEq } from "../util"

test("buffer to X to buffer", () => {
  const buf = new ArrayBuffer(6)
  const ua  = new Uint8Array(buf)
  ua[0] = 5
  ua[1] = "h".charCodeAt(0)
  ua[2] = "e".charCodeAt(0)
  ua[3] = "l".charCodeAt(0)
  ua[4] = "l".charCodeAt(0)
  ua[5] = "o".charCodeAt(0)

  const x = VarStr.parse(new ArrayBufferStream(buf))
  expect(abEq(x.toBuffer(), buf)).toBeTruthy()
})

describe("from buffer", () => {
  test("", () => {
    const buf = new ArrayBuffer(6)
    const ua  = new Uint8Array(buf)
    ua[0] = 5
    ua[1] = "h".charCodeAt(0)
    ua[2] = "e".charCodeAt(0)
    ua[3] = "l".charCodeAt(0)
    ua[4] = "l".charCodeAt(0)
    ua[5] = "o".charCodeAt(0)

    const x = VarStr.parse(new ArrayBufferStream(buf))
    expect(x).toBeDefined()
    expect(x.s).toBe("hello")
  })
})

describe("to buffer", () => {
  test("empty string", () => {
    const vs = new VarStr("")
    const ua = new Uint8Array(vs.toBuffer())

    expect(ua.length).toBe(1)
    expect(ua[0]).toBe(0)
  })

  test("short string", () => {
    const vs = new VarStr("hello")
    const ua = new Uint8Array(vs.toBuffer())

    expect(ua.length).toBe(6)
    expect(ua[0]).toBe(5)
    expect(ua[1]).toBe("h".charCodeAt(0))
    expect(ua[2]).toBe("e".charCodeAt(0))
    expect(ua[3]).toBe("l".charCodeAt(0))
    expect(ua[4]).toBe("l".charCodeAt(0))
    expect(ua[5]).toBe("o".charCodeAt(0))
  })
})
