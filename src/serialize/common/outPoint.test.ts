import { Uint32Le } from "./uint32Le"
import { Char32 } from "./char32"
import { OutPoint } from "./outPoint"
import { ArrayBufferStream } from "../arrayBufferStream"
import * as util from "../util"
import * as crypto from "crypto"

const rawHash = crypto.randomBytes(32)
const hash = new Char32(rawHash)
const index = new Uint32Le(2)
const ab = util.concatArrayBufs([
  hash.toBuffer(),
  index.toBuffer(),
])

test("buffer to X to buffer", () => {
})

test("from buffer", () => {
  const x = OutPoint.parse(new ArrayBufferStream(ab))
  expect(util.arrayBuffersIdentical(x.hash.ua.buffer, hash.ua.buffer))
  expect(x.index.n).toBe(index.n)
})

test("to buffer", () => {
  const x = new OutPoint(hash, index)
  const buf = x.toBuffer()
  expect(util.arrayBuffersIdentical(ab, buf))
})