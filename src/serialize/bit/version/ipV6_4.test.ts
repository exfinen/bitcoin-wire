import { IpV6_4 } from "./ipV6_4"
import { ArrayBufferStream } from "../../arrayBufferStream"

test("buffer to X to buffer", () => {
})

test("from buffer", () => {
  const buf = new ArrayBuffer(16)
  const ua = new Uint8Array(buf)
  ua[12] = 10
  ua[13] = 2
  ua[14] = 54
  ua[15] = 201

  const x = IpV6_4.parse(new ArrayBufferStream(buf))
  expect(x).toBeDefined()
  expect(x.octets).toEqual([10, 2, 54, 201])
})

test("to buffer", () => {
  const x = new IpV6_4([10, 2, 54, 201])
  const buf = x.toBuffer()
  const ua = new Uint8Array(buf)
  expect(ua[12]).toBe(10)
  expect(ua[13]).toBe(2)
  expect(ua[14]).toBe(54)
  expect(ua[15]).toBe(201)
})