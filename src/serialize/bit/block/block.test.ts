import { Char32 } from "../../common/char32"
import { Int32Le } from "../../common/int32Le"
import { Uint32Le } from "../../common/uint32Le"
import { VarInt } from "../../common/varInt"
import { Tx } from "./tx"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as crypto from "crypto"
import { abEq, concatArrayBufs } from "../../util"
import { Uint8 } from "../../common/uint8"
import { TxFlag } from "./txFlag"
import { OutPoint } from "../../common/outPoint"
import { UcharArray } from "../../common/ucharArray"
import { TxIn } from "./txIn"
import { Int64Le } from "../../common/int64Le"
import { TxWitnessComponent } from "./txWitnessComponent"
import { TxWitness } from "./txWitness"
import { TxOut } from "./txOut"
import { Block } from "./block"

// tx
const txVersion = new Int32Le(12345)
const txFlag = new TxFlag(Uint8.zero, new Uint8(1))

const txInCount = new VarInt(1)
// TxIn
const hash = new Char32(crypto.randomBytes(32), false)
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
const tx = new Tx(
  txVersion,
  txFlag,
  txInCount,
  [txIn],
  txOutCount,
  [txOut],
  [txWitness],
  lockTime
)

// block
const blockVersion = new Int32Le(12345)
const prevBlock = new Char32(crypto.randomBytes(32))
const merkleRoot = new Char32(crypto.randomBytes(32))
const timestamp = new Uint32Le(Math.floor(new Date().getTime() / 1000))
const bits = new Uint32Le(3456)
const nonce = new Uint32Le(678)
const txnCount = new VarInt(1)
const txns = [tx]

const blockAb = concatArrayBufs([
  blockVersion.toBuffer(),
  prevBlock.toBuffer(),
  merkleRoot.toBuffer(),
  timestamp.toBuffer(),
  bits.toBuffer(),
  nonce.toBuffer(),
  txnCount.toBuffer(),
  tx.toBuffer()
])

const block = new Block(
  blockVersion,
  prevBlock,
  merkleRoot,
  timestamp,
  bits,
  nonce,
  txnCount,
  txns
)

test("buffer to X to buffer", () => {
  const x = Block.parse(new ArrayBufferStream(blockAb))
  expect(abEq(x.toBuffer(), blockAb)).toBeTruthy()
})

test("from buffer", () => {
  const x = Block.parse(new ArrayBufferStream(blockAb))
  expect(x.version.n).toBe(blockVersion.n)
  expect(abEq(x.prevBlock.ua.buffer, prevBlock.ua.buffer)).toBeTruthy()
  expect(abEq(x.merkleRoot.ua.buffer, merkleRoot.ua.buffer)).toBeTruthy()
  expect(x.timestamp.n).toBe(timestamp.n)
  expect(x.bits.n).toBe(bits.n)
  expect(x.nonce.n).toBe(nonce.n)
  expect(x.txnCount.n).toBe(txnCount.n)
  expect(x.txns.length).toBe(1)
  expect(abEq(x.txns[0].toBuffer(), tx.toBuffer())).toBeTruthy()
})

test("to buffer", () => {
  const buf = block.toBuffer()

  expect(abEq(buf, blockAb)).toBeTruthy()
})
