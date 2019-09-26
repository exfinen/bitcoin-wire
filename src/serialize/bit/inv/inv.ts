import { Payload } from "../message/payload"
import { Parser } from "../../parser"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as util from "../../util"
import { VarInt } from "../../common/varInt"
import { InvVect } from "./invVect"

export class Inv extends Parser implements Payload {
  count: VarInt
  inventory: InvVect[]

  constructor(count: VarInt, inventory: InvVect[]) {
    super()
    this.count = count
    this.inventory = inventory
  }

  getName(): string {
    return "inv"
  }

  getBuffer(): ArrayBuffer {
    return this.toBuffer()
  }

  toBuffer(): ArrayBuffer {
    const inventoryBuf = util.concatArrayBufs(
      this.inventory.map(x => x.toBuffer())
    )
    return util.concatArrayBufs([
      this.count.toBuffer(),
      inventoryBuf,
    ])
  }

  static parse(st: ArrayBufferStream): Inv | undefined {
    return util.tryParse("Inv", () => {
      const count = VarInt.parse(st)
      if (!count) {
        return undefined
      }
      const inventory: InvVect[] = []
      for(let i=0; i<count.n; ++i) {
        const invVect = InvVect.parse(st)
        if (!invVect) {
          return undefined
        }
        inventory.push(invVect)
      }
      return new Inv(count, inventory)
    })
  }
}