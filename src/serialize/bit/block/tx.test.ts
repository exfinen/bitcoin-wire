import { ArrayBufferStream } from "../../arrayBufferStream"
import { Int32Le } from "../../common/int32Le"
import { Uint32Le } from "../../common/uint32Le"
import { Tx } from "./tx"
import { TxIn } from "./txIn"
import { TxOut } from "./txOut"
import { OutPoint } from "../../common/outPoint"
import { VarInt } from "../../common/varInt"
import { TxFlag } from "./txFlag"
import { TxWitness } from "./txWitness"
import { TxWitnessComponent } from "./txWitnessComponent"
import { Uint8 } from "../../common/uint8"
import { Int64Le } from "../../common/int64Le"
import { Char32 } from "../../common/char32"
import { UcharArray } from "../../common/ucharArray"
import * as crypto from "crypto"
import { abEq, concatArrayBufs, reverseArrayBuffer } from "../../util"

const version = new Int32Le(12345)
const flag = new TxFlag(Uint8.zero, new Uint8(1))

const txInCount = new VarInt(1)
// TxIn
const hash = new Char32(crypto.randomBytes(32))
const prevOut = new OutPoint(hash, new Uint32Le(0))
const sigScriptSrc = "some script"
const scriptLen = new VarInt(sigScriptSrc.length)
const sigScript = UcharArray.fromStr(sigScriptSrc)
const sequence = new Uint32Le(1)
const txIn = new TxIn(prevOut, scriptLen, sigScript, sequence)

const txOutCount = new VarInt(1)
// TxOut
const valueSrc = BigInt(1234567890)
const value = new Int64Le(valueSrc)
const pkScriptSrc = "some pk script"
const pkScript = UcharArray.fromStr(pkScriptSrc)
const pkScriptLen = new VarInt(pkScriptSrc.length)
const txOut = new TxOut(value, pkScriptLen, pkScript)

// TxWitness
const count = new VarInt(1)
const componentDataSrc = Buffer.from("34567")
const componentLen = new VarInt(componentDataSrc.length)
const componentData = new UcharArray(componentDataSrc)
const txWitnessComponent = new TxWitnessComponent(componentLen, componentData)
const txWitness = new TxWitness(count, [txWitnessComponent])

const lockTime = new Uint32Le(0); // not locked

const txFlagOnAb = concatArrayBufs([
  version.toBuffer(),
  flag.toBuffer(),
  txInCount.toBuffer(),
  txIn.toBuffer(),
  txOutCount.toBuffer(),
  txOut.toBuffer(),
  txWitness.toBuffer(),
  lockTime.toBuffer()
])

const txFlagOffAb = concatArrayBufs([
  version.toBuffer(),
  txInCount.toBuffer(),
  txIn.toBuffer(),
  txOutCount.toBuffer(),
  txOut.toBuffer(),
  lockTime.toBuffer()
])

function doFromBufferTest(buf: ArrayBuffer, isFlagOn: boolean) {
  const x = Tx.parse(new ArrayBufferStream(buf))

  expect(x.version.n).toBe(12345)
  if (isFlagOn) {
    expect(x.flag.v1.n).toBe(0)
    expect(x.flag.v2.n).toBe(1)
    expect(x.txInCount.n).toBe(1)
  }
  // txIn
  expect(
    abEq(
      x.txIn[0].prevOut.hash.ua.buffer,
      reverseArrayBuffer(hash.ua.buffer),
    )
  ).toBeTruthy()
  expect(x.txIn[0].prevOut.index.n).toBe(0)
  expect(x.txIn[0].scriptLen.n).toBe(sigScriptSrc.length)
  expect(
    abEq(
      x.txIn[0].sigScript.ab,
      Buffer.from(sigScriptSrc)
    )
  )
  expect(x.txIn[0].sequence.n).toBe(1)

  expect(x.txOutCount.n).toBe(1)
  // txOut
  expect(txOutCount.n).toBe(1)
  expect(x.txOut[0].value.n).toBe(valueSrc)
  expect(x.txOut[0].pkScriptLen.n).toBe(pkScriptSrc.length)
  expect(
    abEq(
      x.txOut[0].pkScript.ab,
      Buffer.from(pkScriptSrc)
    )
  )

  // txWitness
  if (isFlagOn) {
    expect(x.txWitness.length).toBe(1)
    expect(x.txWitness[0].count.n).toBe(1)
    expect(x.txWitness[0].components.length).toBe(1)
    expect(x.txWitness[0].components[0].length.n).toBe(
      componentDataSrc.length
    )
    expect(
      abEq(
        x.txWitness[0].components[0].body.ab,
        Buffer.from(componentDataSrc)
      )
    )
  }

  expect(x.lockTime.n).toBe(0)
}

describe("flag on", () => {
  test("buffer to X to buffer", () => {
    const st = new ArrayBufferStream(txFlagOnAb)
    const x = Tx.parse(st)
    expect(abEq(x.toBuffer(), txFlagOnAb))
  })

  test.only("from buffer", () => {
    doFromBufferTest(txFlagOnAb, true)
  })

  test("to buffer", () => {
    const tx = new Tx(
      version,
      flag,
      txInCount,
      [txIn],
      txOutCount,
      [txOut],
      [txWitness],
      lockTime
    )
    const buf = tx.toBuffer()
    expect(abEq(buf, txFlagOnAb)).toBeTruthy()
  })
})

describe("flag off", () => {
  test("buffer to X to buffer", () => {
    const st = new ArrayBufferStream(txFlagOffAb)
    const x = Tx.parse(st)
    expect(abEq(x.toBuffer(), txFlagOffAb))
  })

  test("from buffer", () => {
    doFromBufferTest(txFlagOffAb, false)
  })

  test("to buffer", () => {
    const tx = new Tx(
      version,
      undefined,
      txInCount,
      [txIn],
      txOutCount,
      [txOut],
      [],
      lockTime
    )
    const buf = tx.toBuffer()
    expect(abEq(buf, txFlagOffAb)).toBeTruthy()
  })
})
