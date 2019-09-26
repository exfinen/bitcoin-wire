import { ArrayBufferStream } from "../../arrayBufferStream"
import { abEq, concatArrayBufs } from "../../util"
import { Uint8 } from "../../common/uint8"
import { TxFlag } from "./txFlag"

const v1 = Uint8.zero
const v2 = new Uint8(1)
const ab = concatArrayBufs([v1.toBuffer(), v2.toBuffer()])

test("buffer to X to buffer", () => {
  const x = TxFlag.parse(new ArrayBufferStream(ab))
  expect(abEq(x.toBuffer(), ab)).toBeTruthy()
})

test("from buffer", () => {
  const x = TxFlag.parse(new ArrayBufferStream(ab))
  expect(x.v1.n).toBe(v1.n)
  expect(x.v2.n).toBe(v2.n)
})

test("to buffer", () => {
  const x = new TxFlag(v1, v2)
  const buf = x.toBuffer()
  expect(abEq(ab, buf))
})
