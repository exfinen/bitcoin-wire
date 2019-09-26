import { InvVect, InvType } from "./invVect"
import { VarInt } from "../../common/varInt"
import { Char32 } from "../../common/char32"
import { Uint32Le } from "../../common/uint32Le"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as crypto from "crypto"
import { abEq, concatArrayBufs } from "../../util"
import { Inv } from "./inv"

const type1 = new Uint32Le(InvType.MSG_TX)
const rawHash1 = new Uint8Array(crypto.randomBytes(32))
const hash1 = new Char32(rawHash1)
const iv1 = new InvVect(type1, hash1)

const type2 = new Uint32Le(InvType.MSG_BLOCK)
const rawHash2 = new Uint8Array(crypto.randomBytes(32))
const hash2 = new Char32(rawHash2)
const iv2 = new InvVect(type2, hash2)

const count = new VarInt(2)

const ab = concatArrayBufs([
  count.toBuffer(),
  iv1.toBuffer(),
  iv2.toBuffer(),
])

test("buffer to X to buffer", () => {
  const x = Inv.parse(new ArrayBufferStream(ab))
  expect(abEq(x.toBuffer(), ab)).toBeTruthy()
})

test("from buffer", () => {
  const x = Inv.parse(new ArrayBufferStream(ab))
  expect(x).toBeDefined()
  expect(x.count.n).toBe(2)
  expect(x.inventory.length).toBe(2)

  const iv1 = x.inventory[0]
  expect(iv1.type.n).toBe(InvType.MSG_TX)
  expect(abEq(iv1.hash.ua.buffer, hash1.ua.buffer)).toBeTruthy()

  const iv2 = x.inventory[1]
  expect(iv2.type.n).toBe(InvType.MSG_BLOCK)
  expect(abEq(iv2.hash.ua.buffer, hash2.ua.buffer)).toBeTruthy()
})

test("to buffer", () => {
  const x = new Inv(count, [iv1, iv2])
  const buf = x.toBuffer()
  expect(abEq(buf, ab)).toBeTruthy()
})
