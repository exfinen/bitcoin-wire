import { Parser } from "../../parser"
import { Int32Le } from "../../common/int32Le"
import { VarInt } from "../../common/varInt"
import { Char32 } from "../../common/char32"
import { Payload } from "../message/payload"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as util from "../../util"


export class GetHeaders extends Parser implements Payload {
  version: Int32Le
  hashCount: VarInt
  blockLocatorHashes: Char32[]
  hashStop: Char32

  constructor(
    version: Int32Le,
    hashCount: VarInt,
    blockLocatorHashes: Char32[],
    hashStop: Char32,
  ) {
    super()
    this.version = version
    this.hashCount = hashCount
    this.blockLocatorHashes = blockLocatorHashes
    this.hashStop = hashStop
  }

  getName(): string {
    return "getheaders"
  }

  getBuffer(): ArrayBuffer {
    return this.toBuffer()
  }

  toBuffer(): ArrayBuffer {
    return util.concatArrayBufs([
      this.version.toBuffer(),
      this.hashCount.toBuffer(),
      util.concatArrayBufs(this.blockLocatorHashes.map(x => x.toBuffer())),
      this.hashStop.toBuffer(),
    ])
  }

  static parse(st: ArrayBufferStream): GetHeaders | undefined {
    return util.tryParse("GetHeaders", () => {
      const version = Int32Le.parse(st)
      if (!version) {
        return undefined
      }
      const hashCount = VarInt.parse(st)
      if (!hashCount) {
        return undefined
      }
      const blockLocatorHashes: Char32[] = []
      for(let i=0; i<hashCount.n; ++i) {
        const x = Char32.parse(st)
        if (!x) {
          return undefined
        }
        blockLocatorHashes.push(x)
      }
      const hashStop = Char32.parse(st)
      if (!hashStop) {
        return undefined
      }
      return new GetHeaders(
        version,
        hashCount,
        blockLocatorHashes,
        hashStop
      )
    })
  }

  static gen_block_locator_indexes(startHeight: number): number[] {
    const xs = []
    let step = 1

    for(let i=startHeight; i>0; i-=step) {
      if (xs.length >= 10) {
        step *= 2
      }
      xs.push(i)
    }
    xs.push(0)

    return xs
  }
}
