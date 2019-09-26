import { ArrayBufferStream } from "../../arrayBufferStream"
import { abEq, concatArrayBufs } from "../../util"
import { UcharArray } from "../../common/ucharArray"
import { VarInt } from "../../common/varInt"
import { TxWitnessComponent } from "./txWitnessComponent"

const v = [1,2,3,4,5]
const length = new VarInt(v.length)
const bodyBuf = new Uint8Array(v)
const body = new UcharArray(bodyBuf)

const ab = concatArrayBufs([
  length.toBuffer(),
  body.toBuffer(),
])

test("buffer to X to buffer", () => {
  const x = TxWitnessComponent.parse(new ArrayBufferStream(ab))
  expect(abEq(x.toBuffer(), ab)).toBeTruthy()
})

test("from buffer", () => {
  const x = TxWitnessComponent.parse(new ArrayBufferStream(ab))
  expect(x.length.n).toBe(v.length)
  expect(x.body.toBuffer()).toEqual(bodyBuf.buffer)
})

test("to buffer", () => {
  const x = new TxWitnessComponent(length, body)
  const buf = x.toBuffer()
  expect(abEq(ab, buf)).toBeTruthy()
})