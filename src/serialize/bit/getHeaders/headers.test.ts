import { Headers } from "./headers"
import { Char32 } from  "../../common/char32"
import { Int32Le } from "../../common/int32Le"
import { Uint32Le } from "../../common/uint32Le"
import { VarInt } from "../../common/varInt"
import { BlockHeader } from "../block/blockHeader"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as crypto from "crypto"
import { abEq, concatArrayBufs } from "../../util"

const version = new Int32Le(12345)
const prevBlock = new Char32(crypto.randomBytes(32))
const merkleRoot = new Char32(crypto.randomBytes(32))
const timestamp = new Uint32Le(new Date().getTime())
const bits = new Uint32Le(39)
const nonce = new Uint32Le(456789)
const txnCount = new VarInt(0)
const blockHeaderAb = concatArrayBufs([
  version.toBuffer(),
  prevBlock.toBuffer(),
  merkleRoot.toBuffer(),
  timestamp.toBuffer(),
  bits.toBuffer(),
  nonce.toBuffer(),
  txnCount.toBuffer(),
])
const count = new VarInt(1)
const headersAb = concatArrayBufs([
  count.toBuffer(),
  blockHeaderAb,
])

test("buffer to X to buffer", () => {
  const x = Headers.parse(new ArrayBufferStream(headersAb))
  expect(abEq(x.toBuffer(), headersAb)).toBeTruthy()
})

test("from buffer", () => {
  const x = Headers.parse(new ArrayBufferStream(headersAb))
  expect(x).toBeDefined()
  expect(x.count.n).toBe(1)
  expect(x.headers.length).toBe(1)
  expect(abEq(x.headers[0].toBuffer(), blockHeaderAb))
})

test("to buffer", () => {
  const headers = [
    BlockHeader.parse(new ArrayBufferStream(blockHeaderAb)),
  ]
  const x = new Headers(count, headers)
  const buf = x.toBuffer()
  expect(abEq(buf, headersAb)).toBeTruthy()
})