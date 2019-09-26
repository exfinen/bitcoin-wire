import { Parser } from "../../parser"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as util from "../../util"
import { VarInt } from "../../common/varInt"
import { TxWitnessComponent } from "./txWitnessComponent"

export class TxWitness extends Parser {
  count: VarInt
  components: TxWitnessComponent[]

  constructor(
    count: VarInt,
    components: TxWitnessComponent[]
  ) {
    super()
    this.count = count
    this.components = components
  }

  toBuffer(): ArrayBuffer {
    const components = util.concatArrayBufs(
      this.components.map(x => x.toBuffer())
    )
    return util.concatArrayBufs([
      this.count.toBuffer(),
      components,
    ])
  }

  static parse(st: ArrayBufferStream): TxWitness | undefined {
    return util.tryParse("TxWitness", () => {
      const count = VarInt.parse(st)
      if (!count) {
        return undefined
      }
      const components = []
      for(let i=0; i<count.n; ++i) {
        const component = TxWitnessComponent.parse(st)
        components.push(component)
      }
      return new TxWitness(count, components)
    })
  }
}