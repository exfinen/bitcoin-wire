import { VarInt } from "./varInt"
import { ArrayBufferStream } from "../arrayBufferStream"
import { abEq } from "../util"

describe("buffer to X to buffer", () => {
  test("1-byte number", () => { // 0
    const buf = new ArrayBuffer(1)
    const ua = new Uint8Array(buf)
    ua[0] = 5
    const x = VarInt.parse(new ArrayBufferStream(buf))
    expect(abEq(x.toBuffer(), buf)).toBeTruthy()
  })

  test("3-byte number", () => { // 0xfd
    const buf = new ArrayBuffer(3)
    const ua = new Uint8Array(buf)
    ua[0] = 0xfd
    ua[1] = 0xfd
    ua[2] = 0
    const x = VarInt.parse(new ArrayBufferStream(buf))
    expect(abEq(x.toBuffer(), buf)).toBeTruthy()
  })

  test("5-byte number", () => { // 0x10000
    const buf = new ArrayBuffer(5)
    const ua = new Uint8Array(buf)
    ua[0] = 0xfe
    ua[1] = 0
    ua[2] = 0
    ua[3] = 1
    ua[4] = 0
    const x = VarInt.parse(new ArrayBufferStream(buf))
    expect(abEq(x.toBuffer(), buf)).toBeTruthy()
  })

  test("9-byte number", () => { // 0x100000000
    const buf = new ArrayBuffer(9)
    const ua = new Uint8Array(buf)
    ua[0] = 0xff
    ua[1] = 0
    ua[2] = 0
    ua[3] = 0
    ua[4] = 0
    ua[5] = 1
    ua[6] = 0
    ua[7] = 0
    ua[8] = 0
    const x = VarInt.parse(new ArrayBufferStream(buf))
    expect(abEq(x.toBuffer(), buf)).toBeTruthy()
  })
})

describe("from buffer", () => {
  describe("1-byte number", () => {
    test("should convert 5", () => {
      const buf = new ArrayBuffer(1)
      const ua = new Uint8Array(buf)
      ua[0] = 5
      const x = VarInt.parse(new ArrayBufferStream(buf))
      expect(x).toBeDefined()
      expect(x.n).toBe(5)
    })

    test("should convert 0xfd - 1", () => {
      const buf = new ArrayBuffer(1)
      const ua = new Uint8Array(buf)
      ua[0] = 0xfd - 1
      const x = VarInt.parse(new ArrayBufferStream(buf))
      expect(x).toBeDefined()
      expect(x.n).toBe(0xfd - 1)
    })
  })

  describe("3-byte number", () => {
    test("should convert 0xfd", () => {
      const buf = new ArrayBuffer(3)
      const ua = new Uint8Array(buf)
      ua[0] = 0xfd
      ua[1] = 0xfd
      ua[2] = 0
      const x = VarInt.parse(new ArrayBufferStream(buf))
      expect(x).toBeDefined()
      expect(x.n).toBe(0xfd)
    })

    test("should convert 0xffff", () => {
      const buf = new ArrayBuffer(3)
      const ua = new Uint8Array(buf)
      ua[0] = 0xfd
      ua[1] = 0xff
      ua[2] = 0xff
      const x = VarInt.parse(new ArrayBufferStream(buf))
      expect(x).toBeDefined()
      expect(x.n).toBe(0xffff)
    })
  })

  describe("5-byte number", () => {
    test("should convert 0x10000", () => {
      const buf = new ArrayBuffer(5)
      const ua = new Uint8Array(buf)
      ua[0] = 0xfe
      ua[1] = 0
      ua[2] = 0
      ua[3] = 1
      ua[4] = 0
      const x = VarInt.parse(new ArrayBufferStream(buf))
      expect(x).toBeDefined()
      expect(x.n).toBe(0x10000)
    })

    test("should convert 0xffffffff", () => {
      const buf = new ArrayBuffer(5)
      const ua = new Uint8Array(buf)
      ua[0] = 0xfe
      ua[1] = 0xff
      ua[2] = 0xff
      ua[3] = 0xff
      ua[4] = 0xff
      const x = VarInt.parse(new ArrayBufferStream(buf))
      expect(x).toBeDefined()
      expect(x.n).toBe(0xffffffff)
    })
  })

  describe("9-byte number", () => {
    test("should convert 0x100000000", () => {
      const buf = new ArrayBuffer(9)
      const ua = new Uint8Array(buf)
      ua[0] = 0xff
      ua[1] = 0
      ua[2] = 0
      ua[3] = 0
      ua[4] = 0
      ua[5] = 1
      ua[6] = 0
      ua[7] = 0
      ua[8] = 0
      const x = VarInt.parse(new ArrayBufferStream(buf))
      expect(x).toBeDefined()
      expect(x.n).toBe(BigInt("0x100000000"))
    })

    test("should convert 0xffffffffffffffff", () => {
      const buf = new ArrayBuffer(9)
      const ua = new Uint8Array(buf)
      ua[0] = 0xff
      ua[1] = 0xff
      ua[2] = 0xff
      ua[3] = 0xff
      ua[4] = 0xff
      ua[5] = 0xff
      ua[6] = 0xff
      ua[7] = 0xff
      ua[8] = 0xff
      const x = VarInt.parse(new ArrayBufferStream(buf))
      expect(x).toBeDefined()
      expect(x.n).toBe(BigInt("0xffffffffffffffff"))
    })
  })
})

describe("to buffer", () => {
  test("1-byte number", () => { // 0
    const x = new VarInt(0)
    const buf = x.toBuffer()
    const ua = new Uint8Array(buf)
    expect(ua.length).toBe(1)
    expect(ua[0]).toBe(0)
  })

  test("3-byte number", () => { // 0xfd
    const x = new VarInt(0xfd)
    const buf = x.toBuffer()
    const ua = new Uint8Array(buf)
    expect(ua.length).toBe(3)
    expect(ua[0]).toBe(0xfd)
    expect(ua[1]).toBe(0xfd)
    expect(ua[2]).toBe(0)
  })

  test("5-byte number", () => { // 0x10000
    const x = new VarInt(0x10000)
    const buf = x.toBuffer()
    const ua = new Uint8Array(buf)
    expect(ua[0]).toBe(0xfe)
    expect(ua[1]).toBe(0)
    expect(ua[2]).toBe(0)
    expect(ua[3]).toBe(1)
    expect(ua[4]).toBe(0)
  })

  test("9-byte number", () => { // 0x100000000
    const x = new VarInt(BigInt("0x100000000"))
    const buf = x.toBuffer()
    const ua = new Uint8Array(buf)
    expect(ua[0]).toBe(0xff)
    expect(ua[1]).toBe(0)
    expect(ua[2]).toBe(0)
    expect(ua[3]).toBe(0)
    expect(ua[4]).toBe(0)
    expect(ua[5]).toBe(1)
    expect(ua[6]).toBe(0)
    expect(ua[7]).toBe(0)
    expect(ua[8]).toBe(0)
  })
})