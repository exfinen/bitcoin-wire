import { Parser } from "../../parser"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as util from "../../util"
import { OutPoint } from "../../common/outPoint"
import { VarInt } from "../../common/varInt"
import { Uint32Le } from "../../common/uint32Le"
import { UcharArray } from "../../common/ucharArray"

export class TxIn extends Parser {
  prevOut: OutPoint
  scriptLen: VarInt
  sigScript: UcharArray
  sequence: Uint32Le

  constructor(
    prevOut: OutPoint,
    scriptLen: VarInt,
    sigScript: UcharArray,
    sequence: Uint32Le
  ) {
    super()
    this.prevOut = prevOut
    this.scriptLen = scriptLen
    this.sigScript = sigScript
    this.sequence = sequence
  }

  toBuffer(): ArrayBuffer {
    return util.concatArrayBufs([
      this.prevOut.toBuffer(),
      this.scriptLen.toBuffer(),
      this.sigScript.toBuffer(),
      this.sequence.toBuffer(),
    ])
  }

  static parse(st: ArrayBufferStream): TxIn | undefined {
    return util.tryParse("TxIn", () => {
      const prevOut = OutPoint.parse(st)
      if (!prevOut) {
        return undefined
      }
      const scriptLen = VarInt.parse(st)
      if (!scriptLen) {
        return undefined
      }
      if (scriptLen.n === 0) {
        console.debug(`Script length is zero`)
      }
      const sigScript = UcharArray.parse(st, scriptLen.n as number)
      if (!sigScript) {
        return undefined
      }
      const sequence = Uint32Le.parse(st)
      if (!sequence) {
        return undefined
      }
      return new TxIn(prevOut, scriptLen, sigScript, sequence)
    })
  }
}