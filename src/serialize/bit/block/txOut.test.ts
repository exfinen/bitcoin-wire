import { ArrayBufferStream } from "../../arrayBufferStream"
import { abEq, concatArrayBufs } from "../../util"
import { Int64Le } from "../../common/int64Le"
import { UcharArray } from "../../common/ucharArray"
import { VarInt } from "../../common/varInt"
import { TxOut } from "./txOut"

const valueBody = BigInt(12345)
const value = new Int64Le(valueBody)
const pkScriptBody = Buffer.from("some script")
const pkScriptLen = new VarInt(pkScriptBody.length)
const pkScript = new UcharArray(pkScriptBody)

const ab = concatArrayBufs([
  value.toBuffer(),
  pkScriptLen.toBuffer(),
  pkScript.toBuffer(),
])

test("buffer to X to buffer", () => {
  const x = TxOut.parse(new ArrayBufferStream(ab))
  expect(abEq(x.toBuffer(), ab)).toBeTruthy()
})

test("from buffer", () => {
  const x = TxOut.parse(new ArrayBufferStream(ab))
  expect(x.value.n).toBe(valueBody)
  expect(x.pkScriptLen.n).toBe(pkScriptBody.length)
  expect(abEq(x.pkScript.ab, pkScriptBody))
})

test("to buffer", () => {
  const x = new TxOut(value, pkScriptLen, pkScript)
  const buf = x.toBuffer()
  expect(abEq(ab, buf))
})