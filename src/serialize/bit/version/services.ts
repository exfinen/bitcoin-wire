import { Parser } from "../../parser"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as util from "../../util"

export enum Service {
  NODE_NETWORK = 1,
  NODE_GETUTXO = 2,
  NODE_BLOOM = 3,
  NODE_WITNESS = 8,
  NODE_NETWORK_LIMITED = 1024,
}

// 8	services	uint64_t
export class Services extends Parser {
  services: bigint

  constructor(services: bigint) {
    super()
    this.services = services
  }

  toBuffer(): ArrayBuffer {
    const buf = new ArrayBuffer(8)
    const dv = new DataView(buf)

    dv.setBigUint64(0, this.services, true)
    return buf
  }

  static parse(st: ArrayBufferStream): Services | undefined {
    return util.tryParse("Services", () => {
      const buf = st.take(8)
      if (!buf) {
        return undefined
      }
      const dv = new DataView(buf)
      const services = dv.getBigUint64(0, true)
      return new Services(services)
    })
  }
}