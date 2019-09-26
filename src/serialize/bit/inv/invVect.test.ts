import { Char32 } from "../../common/char32"
import { InvVect, InvType } from "./invVect"
import { Uint32Le } from "../../common/uint32Le"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as crypto from "crypto"
import { abEq, concatArrayBufs } from "../../util"

const invType = InvType.MSG_BLOCK
const type = new Uint32Le(invType)
const hash = new Char32(new Uint8Array(crypto.randomBytes(32)))
const ab = concatArrayBufs([
  type.toBuffer(),
  hash.toBuffer(),
])

test("buffer to X to buffer", () => {
  const x = InvVect.parse(new ArrayBufferStream(ab))
  expect(abEq(x.toBuffer(), ab)).toBeTruthy()
})

test("from buffer", () => {
  const x = InvVect.parse(new ArrayBufferStream(ab))
  expect(x).toBeDefined()
  expect(x.type.n).toBe(invType)
  expect(abEq(x.hash.ua.buffer, hash.ua.buffer)).toBeTruthy()
})

test("to buffer", () => {
  const x = new InvVect(type, hash)
  const buf = x.toBuffer()
  expect(abEq(buf, ab)).toBeTruthy()
})