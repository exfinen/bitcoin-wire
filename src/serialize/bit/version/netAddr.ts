import { Parser } from "../../parser"
import { Services } from "./services"
import { Uint32Le } from "../../common/uint32Le"
import { IpV6_4 } from "./ipV6_4"
import { Uint16Be } from "../../common/uint16Be"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as util from "../../util"

export class NetAddr extends Parser {
  services: Services
  ipV4: IpV6_4
  port: Uint16Be
  time?: Uint32Le

  constructor(services: Services, ipV4: IpV6_4, port: Uint16Be, time?: Uint32Le) {
    super()
    this.services = services
    this.ipV4 = ipV4
    this.port = port
    this.time = time
  }

  toBuffer(): ArrayBuffer {
    return this.parsers2Buffer([
      this.time,
      this.services,
      this.ipV4,
      this.port
    ])
  }

  static parse(st: ArrayBufferStream, includeTime: boolean): NetAddr | undefined {
    return util.tryParse("NetAddr", () => {
      let time: Uint32Le | undefined = undefined
      if (includeTime) {
        time = Uint32Le.parse(st)
        if (!time) {
          return undefined
        }
      }
      const services = Services.parse(st)
      if (!services) {
        return undefined
      }
      const ipV4 = IpV6_4.parse(st)
      if (!ipV4) {
        return undefined
      }
      const port = Uint16Be.parse(st)
      if (!port) {
        return undefined
      }
      return new NetAddr(services, ipV4, port, time)
    })
  }
}