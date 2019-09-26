import { UcharArray32 } from "./ucharArray32"
import { ArrayBufferStream } from "../arrayBufferStream"
import * as util from "../util"

const s = "12345678901234567890123456789012"

const buf = Buffer.from(s)

test("buffer to X to buffer", () => {
})

test("from buffer", () => {
  const x = UcharArray32.parse(new ArrayBufferStream(buf))
  expect(x).toBeDefined()
  expect(util.arrayBuffersIdentical(x.ab, buf)).toBeTruthy()
})

test("to buffer", () => {
  const x = new UcharArray32(buf)
  expect(util.arrayBuffersIdentical(x.ab, buf)).toBeTruthy()
})