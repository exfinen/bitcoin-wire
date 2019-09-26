import { Checksum } from "./checksum"
import { ArrayBufferStream } from "../../arrayBufferStream"
import { abEq } from "../../util"

const ua = new Uint8Array([1, 2, 3, 4])

test("buffer to X to buffer", () => {
  const ua = new Uint8Array([1, 2, 3, 4])
  const x = Checksum.parse(new ArrayBufferStream(ua.buffer))
  expect(abEq(x.toBuffer(), ua)).toBeTruthy()
})

test("from buffer", () => {
  const x = Checksum.parse(new ArrayBufferStream(ua.buffer))
  expect(x).toBeDefined()

  const ua2 = new Uint8Array(x.v)
  expect(ua2.length).toBe(4)
  expect(ua2[0]).toBe(1)
  expect(ua2[1]).toBe(2)
  expect(ua2[2]).toBe(3)
  expect(ua2[3]).toBe(4)
})

test("to buffer", () => {
  const ua = new Uint8Array([1, 2, 3, 4])
  const x = new Checksum(ua.buffer)
  const ua2 = new Uint8Array(x.toBuffer())
  expect(ua2.length).toBe(4)
  expect(ua2[0]).toBe(1)
  expect(ua2[1]).toBe(2)
  expect(ua2[2]).toBe(3)
  expect(ua2[3]).toBe(4)
})

test("shorter checksum given", () => {
  expect(() => new Checksum(new Uint8Array([1, 2, 3]).buffer)).toThrow()
})

test("longer checksum given", () => {
  expect(() => new Checksum(new Uint8Array([1, 2, 3, 4, 5]).buffer)).toThrow()
})