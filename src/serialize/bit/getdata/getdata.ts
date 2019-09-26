import { Payload } from "../message/payload"
import { ArrayBufferStream } from "../../arrayBufferStream"
import { VarInt } from "../../common/varInt"
import { Inv } from "../inv/inv"
import { InvVect } from "../inv/invVect"
import * as util from "../../util"

export class GetData extends Inv implements Payload {
  constructor(count: VarInt, inventory: InvVect[]) {
    super(count, inventory)
  }

  getName(): string {
    return "getdata"
  }

  static parse(st: ArrayBufferStream): GetData | undefined {
    return util.tryParse("GetData", () => {
      const inv = Inv.parse(st)
      if (!inv) {
        return undefined
      }
      return inv
    })
  }
}