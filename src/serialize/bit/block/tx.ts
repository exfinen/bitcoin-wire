import { Parser } from "../../parser"
import { Payload } from "../message/payload"
import { ArrayBufferStream } from "../../arrayBufferStream"
import { reverseArrayBuffer, arrayBuffer2Buffer, concatArrayBufs, tryParse } from "../../util"
import { Int32Le } from "../../common/int32Le"
import { VarInt } from "../../common/varInt"
import { Uint32Le } from "../../common/uint32Le"
import { TxIn } from "./txIn"
import { TxOut } from "./txOut"
import { TxWitness } from "./txWitness"
import { TxFlag } from "./txFlag"
import { sha256 } from "../../util"

export class Tx extends Parser implements Payload {
  version: Int32Le
  flag: TxFlag | undefined
  txInCount: VarInt
  txIn: TxIn[]
  txOutCount: VarInt
  txOut: TxOut[]
  txWitness: TxWitness[] | undefined
  lockTime: Uint32Le

  constructor(
    version: Int32Le,
    flag: TxFlag | undefined,
    txInCount: VarInt,
    txIn: TxIn[],
    txOutCount: VarInt,
    txOut: TxOut[],
    txWitness: TxWitness[] | undefined,
    lockTime: Uint32Le
  ) {
    super()
    this.version = version
    this.flag = flag
    this.txInCount = txInCount
    this.txIn = txIn
    this.txOutCount = txOutCount
    this.txOut = txOut
    this.txWitness = txWitness
    this.lockTime = lockTime
  }

  getName(): string {
    return "tx"
  }

  getBuffer(): ArrayBuffer {
    return this.toBuffer()
  }

  toBuffer(): ArrayBuffer {
    const txIn = concatArrayBufs(this.txIn.map(x => x.toBuffer()))
    const txOut = concatArrayBufs(this.txOut.map(x => x.toBuffer()))
    const txWitness = this.txWitness ?
      concatArrayBufs(this.txWitness.map(x => x.toBuffer())) : undefined
    const abs = [
      this.version.toBuffer(),
      this.txInCount.toBuffer(),
      txIn,
      this.txOutCount.toBuffer(),
      txOut,
      txWitness,
      this.lockTime.toBuffer(),
    ]
    if (this.flag) {
      abs.splice(1, 0, this.flag.toBuffer())
    }
    return concatArrayBufs(abs)
  }

  getTxId(): string {
    const ab = reverseArrayBuffer(
      sha256(sha256(this.getBuffer()))
    )
    return arrayBuffer2Buffer(ab).toString("hex")
  }

  static parse(st: ArrayBufferStream): Tx | undefined {
    return tryParse("Tx", () => {
      const version = Int32Le.parse(st)
      if (!version) {
        return undefined
      }
      let txFlag: TxFlag | undefined = undefined
      const stHead = st.peekHead()
      if (stHead === 0) { // if TxFlag exists
        txFlag = TxFlag.parse(st)
        if (!txFlag) {
          return undefined
        }
      }
      const txInCount = VarInt.parse(st)
      if (!txInCount) {
        return undefined
      }
      const txIns = []
      for(let i=0; i<txInCount.n; ++i) {
        const txIn = TxIn.parse(st)
        if (!txIn) {
          return undefined
        }
        txIns.push(txIn)
      }
      const txOutCount = VarInt.parse(st)
      if (!txOutCount) {
        return undefined
      }
      const txOuts = []
      for(let i=0; i<txOutCount.n; ++i) {
        const txOut = TxOut.parse(st)
        if (!txOut) {
          return undefined
        }
        txOuts.push(txOut)
      }
      let txWitnesses: TxWitness[] | undefined
      if (txFlag) {
        txWitnesses = []
        for(let i=0; i<txInCount.n; ++i) {
          const txWitness = TxWitness.parse(st)
          if (!txWitness) {
            return undefined
          }
          txWitnesses.push(txWitness)
        }
      }
      const lockTime = Uint32Le.parse(st)
      if (!lockTime) {
        return undefined
      }
      return new Tx(
        version,
        txFlag,
        txInCount,
        txIns,
        txOutCount,
        txOuts,
        txWitnesses,
        lockTime
      )
    })
  }
}