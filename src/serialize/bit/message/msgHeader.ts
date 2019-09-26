import { Parser } from "../../parser"
import { Magic } from "./magic"
import { ArrayBufferStream } from "../../arrayBufferStream"
import { Command } from "./command"
import { Uint32Le} from "../../common/uint32Le"
import { Checksum } from "./checksum"
import * as util from "../../util"

export class MsgHeader extends Parser {
  magic: Magic
  command: Command
  length: Uint32Le
  checksum: Checksum

  constructor(
    magic: Magic,
    command: Command,
    length: Uint32Le,
    checksum: Checksum,
  ) {
    super()
    this.magic = magic
    this.command = command
    this.length = length
    this.checksum = checksum
  }

  toBuffer(): ArrayBuffer {
    return util.concatArrayBufs([
      this.magic.toBuffer(),
      this.command.toBuffer(),
      this.length.toBuffer(),
      this.checksum.toBuffer(),
    ])
  }

  static parse(st: ArrayBufferStream): MsgHeader | undefined {
    return util.tryParse("MsgHeader", () => {
      const magic = Magic.parse(st)
      if (!magic) {
        return undefined
      }
      const command = Command.parse(st)
      if (!command) {
        return undefined
      }
      const length = Uint32Le.parse(st)
      if (!length) {
        return undefined
      }
      const checksum = Checksum.parse(st)
      if (!checksum) {
        return undefined
      }
      return new MsgHeader(magic, command, length, checksum)
    })
  }
}