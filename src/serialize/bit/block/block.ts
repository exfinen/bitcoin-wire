import { Parser } from "../../parser"
import { Payload } from "../message/payload"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as util from "../../util"
import { Int32Le } from "../../common/int32Le"
import { Char32 } from "../../common/char32"
import { Uint32Le } from "../../common/uint32Le"
import { VarInt } from "../../common/varInt"
import { Tx } from "./tx"

export class Block extends Parser implements Payload {
  version: Int32Le
  prevBlock: Char32
  merkleRoot: Char32
  timestamp: Uint32Le
  bits: Uint32Le
  nonce: Uint32Le
  txnCount: VarInt
  txns: Tx[]

  constructor(
    version: Int32Le,
    prevBlock: Char32,
    merkleRoot: Char32,
    timestamp: Uint32Le,
    bits: Uint32Le,
    nonce: Uint32Le,
    txnCount: VarInt,
    txns: Tx[],
  ) {
    super()
    this.version = version
    this.prevBlock = prevBlock
    this.merkleRoot = merkleRoot
    this.timestamp = timestamp
    this.bits = bits
    this.nonce = nonce
    this.txnCount = txnCount
    this.txns = txns
  }

  getName(): string {
    return "block"
  }

  getBuffer(): ArrayBuffer {
    return this.toBuffer()
  }

  toBuffer(): ArrayBuffer {
    const txns = util.concatArrayBufs(this.txns.map(x => x.toBuffer()))
    return util.concatArrayBufs([
      this.version.toBuffer(),
      this.prevBlock.toBuffer(),
      this.merkleRoot.toBuffer(),
      this.timestamp.toBuffer(),
      this.bits.toBuffer(),
      this.nonce.toBuffer(),
      this.txnCount.toBuffer(),
      txns
    ])
  }

  static parse(st: ArrayBufferStream): Block | undefined {
    return util.tryParse("block", () => {
      const version = Int32Le.parse(st)
      if (!version) {
        return undefined
      }
      const prevBlock = Char32.parse(st)
      if (!prevBlock) {
        return undefined
      }
      const merkleRoot = Char32.parse(st)
      if (!merkleRoot) {
        return undefined
      }
      const timestamp = Uint32Le.parse(st)
      if (!timestamp) {
        return undefined
      }
      const bits = Uint32Le.parse(st)
      if (!bits) {
        return undefined
      }
      const nonce = Uint32Le.parse(st)
      if (!nonce) {
        return undefined
      }
      const txnCount = VarInt.parse(st)
      if (!txnCount) {
        return undefined
      }
      const txn = []
      for(let i=0; i<txnCount.n; ++i) {
        const tx = Tx.parse(st)
        if (!tx) {
          return undefined
        }
        txn.push(tx)
      }
      return new Block(version, prevBlock, merkleRoot, timestamp, bits, nonce, txnCount, txn)
    })
  }
}