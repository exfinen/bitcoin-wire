import { Payload } from "../message/payload"

export class Verack implements Payload {
  static readonly inst: Verack = new Verack()

  private constructor() {}

  private static emptyBuf = new ArrayBuffer(0)

  getName(): string {
    return "verack"
  }

  getBuffer(): ArrayBuffer {
    return Verack.emptyBuf
  }
}