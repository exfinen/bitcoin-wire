import { Command } from "./command"
import { ArrayBufferStream } from "../../arrayBufferStream"
import { abEq } from "../../util"

test("empty name", () => {
  expect(() => { new Command("")}).toThrow()
})

test("1-char name", () => {
  new Command("1")
})

test("11-char name", () => {
  new Command("12345678901")
})

test("12-char name", () => {
  expect(() => { new Command("123456789012")}).toThrow()
})

test("buffer to X to buffer", () => {
  const x = new Command("hello")
  const ua = new Uint8Array(x.toBuffer())
  expect(abEq(ua, x.toBuffer())).toBeTruthy()
})

test("to buffer", () => {
  const x = new Command("hello")
  const ua = new Uint8Array(x.toBuffer())
  expect(ua.length).toBe(12)

  ua[0] = "h".charCodeAt(0)
  ua[1] = "e".charCodeAt(0)
  ua[2] = "l".charCodeAt(0)
  ua[3] = "l".charCodeAt(0)
  ua[4] = "o".charCodeAt(0)
  for(let i=5; i<12; ++i) {
    expect(ua[i]).toBe(0)
  }
})

test("from buffer", () => {
  const buf = new ArrayBuffer(12)
  const ua = new Uint8Array(buf)
  ua[0] = "h".charCodeAt(0)
  ua[1] = "e".charCodeAt(0)
  ua[2] = "l".charCodeAt(0)
  ua[3] = "l".charCodeAt(0)
  ua[4] = "o".charCodeAt(0)

  const x = Command.parse(new ArrayBufferStream(buf))
  expect(x).toBeDefined()
  expect(x.name).toBe("hello")
})