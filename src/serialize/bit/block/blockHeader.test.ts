import { BlockHeader } from "./blockHeader"
import { Char32 } from "../../common/char32"
import { Int32Le } from "../../common/int32Le"
import { Uint32Le } from "../../common/uint32Le"
import { VarInt } from "../../common/varInt"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as crypto from "crypto"
import { abEq, concatArrayBufs } from "../../util"

const version = new Int32Le(12345)
const prevBlock = new Char32(crypto.randomBytes(32), false)
const merkleRoot = new Char32(crypto.randomBytes(32), false)
const timestamp = new Uint32Le(new Date().getTime())
const bits = new Uint32Le(39)
const nonce = new Uint32Le(456789)
const txnCount = new VarInt(0)
const ab = concatArrayBufs([
  version.toBuffer(),
  prevBlock.toBuffer(),
  merkleRoot.toBuffer(),
  timestamp.toBuffer(),
  bits.toBuffer(),
  nonce.toBuffer(),
  txnCount.toBuffer(),
])

test("buffer to X to buffer", () => {
  const x = BlockHeader.parse(new ArrayBufferStream(ab))
  expect(abEq(x.toBuffer(), ab)).toBeTruthy()
})

test("from buffer", () => {
  const x = BlockHeader.parse(new ArrayBufferStream(ab))
  expect(x).toBeDefined()
  expect(x.version.n).toBe(12345)
  expect(abEq(x.prevBlock.ua.buffer, prevBlock.ua.buffer))
  expect(abEq(x.merkleRoot.ua.buffer, merkleRoot.ua.buffer))
  expect(x.bits.n).toBe(bits.n)
  expect(x.nonce.n).toBe(nonce.n)
  expect(x.txnCount.n).toBe(txnCount.n)
})

test("to buffer", () => {
  const x = new BlockHeader(version, prevBlock, merkleRoot, timestamp, bits, nonce, txnCount)
  const buf = x.toBuffer()
  expect(abEq(buf, ab)).toBeTruthy()
})