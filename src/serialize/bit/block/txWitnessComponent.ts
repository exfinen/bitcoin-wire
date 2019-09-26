import { Parser } from "../../parser"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as util from "../../util"
import { VarInt } from "../../common/varInt"
import { UcharArray } from "../../common/ucharArray"

export class TxWitnessComponent extends Parser {
  length: VarInt
  body: UcharArray

  constructor(
    length: VarInt,
    body: UcharArray
  ) {
    super()
    this.length = length
    this.body = body
  }

  toBuffer(): ArrayBuffer {
    return util.concatArrayBufs([
      this.length.toBuffer(),
      this.body.toBuffer(),
    ])
  }

  static parse(st: ArrayBufferStream): TxWitnessComponent | undefined {
    return util.tryParse("TxWitnessComponent", () => {
      const length = VarInt.parse(st)
      if (!length) {
        return undefined
      }
      const body = UcharArray.parse(st, length.n as number)
      if (!body) {
        return undefined
      }
      return new TxWitnessComponent(length, body)
    })
  }
}