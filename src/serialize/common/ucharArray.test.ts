import { UcharArray } from "./ucharArray"
import { ArrayBufferStream } from "../arrayBufferStream"
import * as util from "../util"

const s = "abcde"

const buf = Buffer.from(s)

test("buffer to X to buffer", () => {
})

test("from buffer", () => {
  const x = UcharArray.parse(new ArrayBufferStream(buf), s.length)
  expect(x).toBeDefined()
  expect(util.arrayBuffersIdentical(x.ab, buf)).toBeTruthy()
})

test("to buffer", () => {
  const x = new UcharArray(buf)
  expect(util.arrayBuffersIdentical(x.ab, buf)).toBeTruthy()
})