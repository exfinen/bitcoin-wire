import { Nonce } from "./nonce"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as crypto from "crypto"
import * as util from "../../util"

const nonceBuf = crypto.randomBytes(8)

test("buffer to X to buffer", () => {
})

test("from buffer", () => {
  const x = Nonce.parse(new ArrayBufferStream(nonceBuf))
  expect(x).toBeDefined()
  expect(util.arrayBuffersIdentical(x.ua, nonceBuf)).toBeTruthy()
})

test("to buffer", () => {
  const x = new Nonce(nonceBuf)
  const buf = x.toBuffer()
  expect(util.arrayBuffersIdentical(buf, nonceBuf)).toBeTruthy()
})