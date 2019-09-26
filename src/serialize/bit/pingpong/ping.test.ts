import { Ping } from "./ping"
import { Nonce } from "../version/nonce"
import { ArrayBufferStream } from "../../arrayBufferStream"
import { abEq } from "../../util"
import * as crypto from "crypto"

const nonceBuf = crypto.randomBytes(8)

test("buffer to X to buffer", () => {
  const x = Ping.parse(new ArrayBufferStream(nonceBuf))
  expect(abEq(x.toBuffer(), nonceBuf)).toBeTruthy()
})

test("from buffer", () => {
  const x = Ping.parse(new ArrayBufferStream(nonceBuf))
  expect(x).toBeDefined()
  expect(abEq(x.nonce.toBuffer(), nonceBuf)).toBeTruthy()
})

test("to buffer", () => {
  const nonce = new Nonce(nonceBuf)
  const x = new Ping(nonce)
  const buf = x.toBuffer()
  expect(abEq(buf, nonceBuf)).toBeTruthy()
})