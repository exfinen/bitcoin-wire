import { Payload } from "./payload"
import { MsgHeader } from "./msgHeader"
import * as util from "../../util"

export class Message {
  header: MsgHeader
  payload: Payload

  constructor(header: MsgHeader, payload: Payload) {
    this.header = header
    this.payload = payload
  }

  toBuffer(): ArrayBuffer {
    return util.concatArrayBufs([
      this.header.toBuffer(),
      this.payload.getBuffer(),
    ])
  }
}