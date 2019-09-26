import { Parser } from "../../parser"
import { ArrayBufferStream } from "../../arrayBufferStream"
import { Int32Le } from "../../common/int32Le"
import { Char32 } from "../../common/char32"
import { Uint32Le } from "../../common/uint32Le"
import { VarInt } from "../../common/varInt"
import * as util from "../../util"

export class BlockHeader extends Parser {
  version: Int32Le
  prevBlock: Char32
  merkleRoot: Char32
  timestamp: Uint32Le
  bits: Uint32Le
  nonce: Uint32Le
  txnCount: VarInt

  constructor(
    version: Int32Le,
    prevBlock: Char32,
    merkleRoot: Char32,
    timestamp: Uint32Le,
    bits: Uint32Le,
    nonce: Uint32Le,
    txnCount: VarInt
  ) {
    super()
    if (txnCount.n !== 0) {
      throw new Error(`TxnCount must be zero, but got: ${txnCount.n}`)
    }
    this.version = version
    this.prevBlock = prevBlock
    this.merkleRoot = merkleRoot
    this.timestamp = timestamp
    this.bits = bits
    this.nonce = nonce
    this.txnCount = txnCount
  }

  toBuffer(): ArrayBuffer {
    return util.concatArrayBufs([
      this.version.toBuffer(),
      this.prevBlock.toBuffer(),
      this.merkleRoot.toBuffer(),
      this.timestamp.toBuffer(),
      this.bits.toBuffer(),
      this.nonce.toBuffer(),
      this.txnCount.toBuffer(),
    ])
  }

  static parse(st: ArrayBufferStream): BlockHeader | undefined {
    return util.tryParse("BlockHeader", () => {
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
      if (txnCount.n !== 0) {
        return undefined
      }
      return new BlockHeader(
        version,
        prevBlock,
        merkleRoot,
        timestamp,
        bits,
        nonce,
        txnCount
      )
    })
  }
}