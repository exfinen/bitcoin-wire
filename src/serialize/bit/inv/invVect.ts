import { Parser } from "../../parser"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as util from "../../util"
import { Uint32Le } from "../../common/uint32Le"
import { Char32 } from "../../common/char32"

export enum InvType {
  ERROR = 0,
  MSG_TX = 1,
  MSG_BLOCK = 2,
  MSG_FILTERED_BLOCK = 3,
  MSG_CMPCT_BLOCK = 4,
}

export class InvVect extends Parser {
  type: Uint32Le
  hash: Char32

  constructor(type: Uint32Le, hash: Char32) {
    super()
    this.type = type
    this.hash = hash
  }

  toBuffer(): ArrayBuffer {
    return util.concatArrayBufs([
      this.type.toBuffer(),
      this.hash.toBuffer(),
    ])
  }

  static parse(st: ArrayBufferStream): InvVect | undefined {
    return util.tryParse("InvVect", () => {
      const type = Uint32Le.parse(st)
      if (!type) {
        return undefined
      }
      const hash = Char32.parse(st)
      if (!hash) {
        return undefined
      }
      return new InvVect(type, hash)
    })
  }
}