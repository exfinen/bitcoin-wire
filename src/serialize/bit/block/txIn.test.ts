import { Uint32Le } from "../../common/uint32Le"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as crypto from "crypto"
import { OutPoint } from "../../common/outPoint"
import { Char32 } from "../../common/char32"
import { UcharArray } from "../../common/ucharArray"
import { TxIn } from "./txIn"
import { VarInt } from "../../common/varInt"
import { abEq, concatArrayBufs } from "../../util"

const hash = new Char32(crypto.randomBytes(32))
const index = new Uint32Le(2)
const prevOut = new OutPoint(hash, index)
const sigScriptBody = Buffer.from("some script")
const scriptLen = new VarInt(sigScriptBody.length)
const sigScript = new UcharArray(sigScriptBody)
const sequence = new Uint32Le(0)

const ab = concatArrayBufs([
  prevOut.toBuffer(),
  scriptLen.toBuffer(),
  sigScript.toBuffer(),
  sequence.toBuffer(),
])

test("buffer to X to buffer", () => {
  const x = TxIn.parse(new ArrayBufferStream(ab))
  expect(abEq(x.toBuffer(), ab)).toBeTruthy()
})

test("from buffer", () => {
  const x = TxIn.parse(new ArrayBufferStream(ab))
  expect(abEq(x.prevOut.hash.ua.buffer, hash.ua.buffer))
  expect(x.prevOut.index.n).toBe(2)
  expect(x.scriptLen.n).toBe(scriptLen.n)
  expect(abEq(x.sigScript.ab, sigScriptBody)).toBeTruthy()
  expect(x.sequence.n).toBe(sequence.n)
})

test("to buffer", () => {
  const x = new TxIn(
    prevOut,
    scriptLen,
    sigScript,
    sequence
  )
  const buf = x.toBuffer()
  expect(abEq(buf, ab)).toBeTruthy()
})
