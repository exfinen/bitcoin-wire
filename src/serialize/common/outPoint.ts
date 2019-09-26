import { Parser } from "../parser"
import { ArrayBufferStream } from "../arrayBufferStream"
import * as util from "../util"
import { Char32 } from "./char32"
import { Uint32Le } from "./uint32Le"

export class OutPoint extends Parser {
  hash: Char32
  index: Uint32Le

  constructor(hash: Char32, index: Uint32Le) {
    super()
    this.hash = hash
    this.index = index
  }

  isCoinbase(): boolean {
    return this.index.n === 0xffffffff
  }

  toBuffer(): ArrayBuffer {
    return util.concatArrayBufs([
      this.hash.toBuffer(),
      this.index.toBuffer(),
    ])
  }

  static parse(st: ArrayBufferStream): OutPoint | undefined {
    return util.tryParse("OutPoint", () => {
      const hash = Char32.parse(st, true)
      if (!hash) {
        return undefined
      }
      const index = Uint32Le.parse(st)
      if (!index) {
        return undefined
      }
      return new OutPoint(hash, index)
    })
  }
}