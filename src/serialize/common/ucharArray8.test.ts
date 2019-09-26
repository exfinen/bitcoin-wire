import { UcharArray8 } from "./ucharArray8"
import { ArrayBufferStream } from "../arrayBufferStream"
import * as util from "../util"

const s = "12345678"

const buf = Buffer.from(s)

test("buffer to X to buffer", () => {
})

test("from buffer", () => {
  const x = UcharArray8.parse(new ArrayBufferStream(buf))
  expect(x).toBeDefined()
  expect(util.arrayBuffersIdentical(x.ab, buf)).toBeTruthy()
})

test("to buffer", () => {
  const x = new UcharArray8(buf)
  expect(util.arrayBuffersIdentical(x.ab, buf)).toBeTruthy()
})