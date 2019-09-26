import { Parser } from "../../parser"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as util from "../../util"
import { Uint8 } from "../../common/uint8"

export class TxFlag extends Parser {
  v1: Uint8
  v2: Uint8

  constructor(
    v1: Uint8,
    v2: Uint8
  ) {
    super()
    if (v1.n !== 0 || v2.n !== 1) {
      throw new Error(`Malformed txFlag v1=${v1.n}, v2=${v2.n}`)
    }
    this.v1 = v1
    this.v2 = v2
  }

  toBuffer(): ArrayBuffer {
    return util.concatArrayBufs([
      this.v1.toBuffer(),
      this.v2.toBuffer(),
    ])
  }

  static parse(st: ArrayBufferStream): TxFlag | undefined {
    return util.tryParse("TxFlag", () => {
      const v1 = Uint8.parse(st)
      if (!v1) {
        return undefined
      }
      const v2 = Uint8.parse(st)
      if (!v2) {
        return undefined
      }
      return new TxFlag(v1, v2)
    })
  }
}