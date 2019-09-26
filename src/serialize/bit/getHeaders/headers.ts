import { Parser } from "../../parser"
import { Payload } from "../message/payload"
import { VarInt } from "../../common/varInt"
import { BlockHeader } from "../block/blockHeader"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as util from "../../util"

export class Headers extends Parser implements Payload {
  count: VarInt
  headers: BlockHeader[]

  constructor(count: VarInt, headers: BlockHeader[]) {
    super()
    this.count = count
    this.headers = headers
  }

  getName(): string {
    return "headers"
  }

  getBuffer(): ArrayBuffer {
    return this.toBuffer()
  }

  toBuffer(): ArrayBuffer {
    const headersBuf = util.concatArrayBufs(this.headers.map(x => x.toBuffer()))
    return util.concatArrayBufs([
      this.count.toBuffer(),
      headersBuf,
    ])
  }

  static parse(st: ArrayBufferStream): Headers | undefined {
    return util.tryParse("headers", () => {
      const count = VarInt.parse(st)
      if (!count) {
        return undefined
      }
      const headers = []
      for(let i=0; i<count.n; ++i) {
        const blockHeader = BlockHeader.parse(st)
        if (!blockHeader) {
          return undefined
        }
        headers.push(blockHeader)
      }
      return new Headers(count, headers)
    })
  }
}