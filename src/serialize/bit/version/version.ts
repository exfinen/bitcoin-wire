import { Parser } from "../../parser"
import { Payload } from "../message/payload"
import { ArrayBufferStream } from "../../arrayBufferStream"
import { Services } from "./services"
import { Int64Le } from "../../common/int64Le"
import { NetAddr } from "./netAddr"
import { VarStr } from "../../common/varStr"
import { Int32Le } from "../../common/int32Le"
import { Bool } from "../../common/bool"
import { Nonce } from "./nonce"
import * as util from "../../util"

export class Version extends Parser implements Payload {
  version: Int32Le
  services: Services
  timestamp: Int64Le
  addrRecv: NetAddr
  // >= 106
  addrFrom: NetAddr | undefined = undefined
  nonce: Nonce | undefined = undefined
  userAgent: VarStr | undefined = undefined
  startHeight: Int32Le | undefined = undefined
  // >= 70001
  relay: Bool | undefined = undefined

  constructor(
    version: Int32Le,
    services: Services,
    timestamp: Int64Le,
    addrRecv: NetAddr,
    addrFrom: NetAddr | undefined,
    nonce: Nonce | undefined,
    userAgent: VarStr | undefined,
    startHeight: Int32Le | undefined,
    relay: Bool | undefined,
  ) {
    super()
    this.userAgent = userAgent
    this.version = version
    this.services = services
    this.timestamp = timestamp
    this.addrRecv = addrRecv
    this.addrFrom = addrFrom
    this.nonce = nonce
    this.startHeight = startHeight
    this.relay = relay
  }

  toBuffer(): ArrayBuffer {
    const a = this.parsers2Buffer([
      this.version,
      this.services,
      this.timestamp,
      this.addrRecv,
      this.addrFrom,
      this.nonce,
    ])

    let b: ArrayBuffer | undefined
    if (!this.userAgent) {
      b = undefined
    } else if (this.userAgent.s.length === 0) { // if empty string, set 0 to userAgent
      b = Buffer.alloc(1, 0)
    } else {
      b = this.userAgent.toBuffer()
    }

    const c = this.parsers2Buffer([
      this.startHeight,
      this.relay,
    ])

    return util.concatArrayBufs([a, b, c])
  }

  getName(): string {
    return "version"
  }

  getBuffer(): ArrayBuffer {
    return this.toBuffer()
  }

  static parse(st: ArrayBufferStream): Version | undefined {
    const version = Int32Le.parse(st)
    if (!version) {
      return undefined
    }
    const services = Services.parse(st)
    if (!services) {
      return undefined
    }
    const timestamp = Int64Le.parse(st)
    if (!timestamp) {
      return undefined
    }
    const addrRecv = NetAddr.parse(st, false)
    if (!addrRecv) {
      return undefined
    }

    let addrFrom = undefined
    let nonce = undefined
    let userAgent = undefined
    let startHeight = undefined
    let relay = undefined

    if (version.n >= 106) {
      addrFrom = NetAddr.parse(st, false)
      if (!addrFrom) {
        return undefined
      }
      nonce  = Nonce.parse(st)
      if (!nonce) {
        return undefined
      }
      userAgent = VarStr.parse(st)
      if (!userAgent) {
        return undefined
      }
      startHeight = Int32Le.parse(st)
      if (!startHeight) {
        return undefined
      }

      if (version.n >= 70001) {
        relay = Bool.parse(st)
        if (!relay) {
          return undefined
        }
      }
    }
    return new Version(
      version,
      services,
      timestamp,
      addrRecv,
      addrFrom,
      nonce,
      userAgent,
      startHeight,
      relay,
    )
  }
}