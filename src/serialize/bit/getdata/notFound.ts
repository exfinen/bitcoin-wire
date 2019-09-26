import { Payload } from "../message/payload"
import { ArrayBufferStream } from "../../arrayBufferStream"
import { VarInt } from "../../common/varInt"
import { Inv } from "../inv/inv"
import { InvVect } from "../inv/invVect"
import * as util from "../../util"

export class NotFound extends Inv implements Payload {
  constructor(count: VarInt, inventory: InvVect[]) {
    super(count, inventory)
  }

  getName(): string {
    return "notfound"
  }

  static parse(st: ArrayBufferStream): NotFound | undefined {
    return util.tryParse("NotFound", () => {
      const inv = Inv.parse(st)
      if (!inv) {
        return undefined
      }
      return inv
    })
  }
}