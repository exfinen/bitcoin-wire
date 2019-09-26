import { Magic } from "./magic"
import { ArrayBufferStream } from "../../arrayBufferStream"
import { abEq } from "../../util"

test("buffer to X to buffer", () => {
  const buf = new Uint8Array([0xf9, 0xbe, 0xb4, 0xd9]).buffer
  const x = Magic.parse(new ArrayBufferStream(buf))
  expect(abEq(x.toBuffer(), buf)).toBeTruthy()
})

describe("from buffer", () => {
  test("main", () => {
    const buf = new Uint8Array([0xf9, 0xbe, 0xb4, 0xd9]).buffer
    const x = Magic.parse(new ArrayBufferStream(buf))
    expect(x).toBeDefined()
    expect(x.network).toBe("main")
  })
  test("testnet", () => {
    const buf = new Uint8Array([0xfa, 0xbf, 0xb5, 0xda]).buffer
    const x = Magic.parse(new ArrayBufferStream(buf))
    expect(x).toBeDefined()
    expect(x.network).toBe("testnet")
  })
  test("testnet3", () => {
    const buf = new Uint8Array([0x0b, 0x11, 0x09, 0x07]).buffer
    const x = Magic.parse(new ArrayBufferStream(buf))
    expect(x).toBeDefined()
    expect(x.network).toBe("testnet3")
  })
})

describe("to buffer", () => {
  test("main", () => {
    const x = new Magic("main")
    const ua = new Uint8Array(x.toBuffer())
    expect(ua.length).toBe(4)
    expect(ua[0]).toBe(0xf9)
    expect(ua[1]).toBe(0xbe)
    expect(ua[2]).toBe(0xb4)
    expect(ua[3]).toBe(0xd9)
  })

  test("testnet", () => {
    const x = new Magic("testnet")
    const ua = new Uint8Array(x.toBuffer())
    expect(ua.length).toBe(4)
    expect(ua[0]).toBe(0xfa)
    expect(ua[1]).toBe(0xbf)
    expect(ua[2]).toBe(0xb5)
    expect(ua[3]).toBe(0xda)
  })

  test("testnet3", () => {
    const x = new Magic("testnet3")
    const ua = new Uint8Array(x.toBuffer())
    expect(ua.length).toBe(4)
    expect(ua[0]).toBe(0x0b)
    expect(ua[1]).toBe(0x11)
    expect(ua[2]).toBe(0x09)
    expect(ua[3]).toBe(0x07)
  })
})