import { ArrayBufferStream } from "../../arrayBufferStream"
import { abEq, concatArrayBufs } from "../../util"
import { VarInt } from "../../common/varInt"
import { TxWitnessComponent } from "./txWitnessComponent"
import { TxWitness } from "./txWitness"
import { UcharArray } from "../../common/ucharArray"

const count = new VarInt(1)
const components = [
  new TxWitnessComponent(
    new VarInt(5),
    UcharArray.fromStr("hello")
  )
]
const ab = concatArrayBufs([
  count.toBuffer(),
  components[0].toBuffer(),
])

test("buffer to X to buffer", () => {
  const x = TxWitness.parse(new ArrayBufferStream(ab))
  expect(abEq(x.toBuffer(), ab)).toBeTruthy()
})

test("from buffer", () => {
  const x = TxWitness.parse(new ArrayBufferStream(ab))
  expect(x.count.n).toBe(1)
  expect(x.components.length).toBe(1)
  expect(x.components[0].length.n).toBe(5)
  expect(x.components[0].body.ab).toEqual(new Uint8Array(Buffer.from("hello")).buffer)
})

test("to buffer", () => {
  const x = new TxWitness(count, components)
  const buf = x.toBuffer()
  expect(abEq(buf, ab)).toBeTruthy()
})