import * as util from "./util"

export class ArrayBufferStream {
  private ua: Uint8Array
  private p: number

  constructor(...bufs: ArrayBuffer[]) {
    if (bufs.length === 1) {
      this.ua = new Uint8Array(bufs[0])
    } else {
      this.ua = new Uint8Array(util.concatArrayBufs(bufs))
    }
    this.p = 0
  }

  peekHead(): number {
    if (this.p >= this.ua.length) {
      return undefined
    }
    return this.ua[this.p]
  }

  getPointer(): number {
    return this.p
  }

  take(n: number): ArrayBuffer | undefined {
    if (n === 0) {
      return new ArrayBuffer(0)
    }
    if (this.p + n > this.ua.length) {
      return undefined
    }
    const ua = this.ua.slice(this.p, this.p + n)
    this.p += n

    return ua.buffer
  }
}