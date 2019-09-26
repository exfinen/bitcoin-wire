import { Char32 } from "./char32"
import { ArrayBufferStream } from "../arrayBufferStream"
import * as crypto from "crypto"
import * as util from "../util"

test("buffer to X to buffer", () => {
})

test("from buffer", () => {
  const buf = crypto.randomBytes(32)

  const x = Char32.parse(new ArrayBufferStream(buf))
  expect(x).toBeDefined()
  expect(x.ua.length).toBe(32)
  expect(util.arrayBuffersIdentical(buf, x.ua.buffer)).toBeTruthy()
})

test("to buffer", () => {
  const x = new Char32(crypto.randomBytes(32))
  const buf = x.toBuffer()
  expect(util.arrayBuffersIdentical(buf, x.ua.buffer)).toBeTruthy()
})