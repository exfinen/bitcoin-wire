import { Pong } from "./pong"
import { Uint64Le } from "../../common/uint64Le"
import { ArrayBufferStream } from "../../arrayBufferStream"
import { abEq } from "../../util"
import * as crypto from "crypto"

const nonceBuf = crypto.randomBytes(8)

test("buffer to X to buffer", () => {
  const x = Pong.parse(new ArrayBufferStream(nonceBuf))
  expect(abEq(x.toBuffer(), nonceBuf)).toBeTruthy()
})

test("from buffer", () => {
  const x = Pong.parse(new ArrayBufferStream(nonceBuf))
  expect(x).toBeDefined()
  expect(abEq(x.nonce.toBuffer(), nonceBuf)).toBeTruthy()
})

test("to buffer", () => {
  const dv = new DataView(nonceBuf.buffer)
  const nonce = new Uint64Le(dv.getBigUint64(0, true))
  const x = new Pong(nonce)
  const buf = x.toBuffer()
  expect(abEq(buf, nonceBuf)).toBeTruthy()
})