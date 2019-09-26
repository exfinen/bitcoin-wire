import { Parser } from "../../parser"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as util from "../../util"
import { Int64Le } from "../../common/int64Le"
import { VarInt } from "../../common/varInt"
import { UcharArray } from "../../common/ucharArray"

export class TxOut extends Parser {
  value: Int64Le
  pkScriptLen: VarInt
  pkScript: UcharArray

  constructor(
    value: Int64Le,
    pkScriptLen: VarInt,
    pkScript: UcharArray
  ) {
    super()
    this.value = value
    this.pkScriptLen = pkScriptLen
    this.pkScript = pkScript
  }

  toBuffer(): ArrayBuffer {
    return util.concatArrayBufs([
      this.value.toBuffer(),
      this.pkScriptLen.toBuffer(),
      this.pkScript.toBuffer(),
    ])
  }

  static parse(st: ArrayBufferStream): TxOut | undefined {
    return util.tryParse("TxOut", () => {
      const value = Int64Le.parse(st)
      if (!value) {
        return undefined
      }
      const pkScriptLen = VarInt.parse(st)
      if (!pkScriptLen) {
        return undefined
      }
      const pkScript = UcharArray.parse(st, pkScriptLen.n as number)
      if (!pkScript) {
        return undefined
      }
      return new TxOut(value, pkScriptLen, pkScript)
    })
  }
}