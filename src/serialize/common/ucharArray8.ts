import { UcharArray } from "./ucharArray"
import { ArrayBufferStream } from "../arrayBufferStream"
import * as Assert from "assert"

export class UcharArray8 extends UcharArray {
  constructor(ab: ArrayBuffer) {
    super(ab)
    Assert.strictEqual(ab.byteLength, 8)
  }

  static parse(st: ArrayBufferStream): UcharArray8 | undefined {
      return UcharArray.parse(st, 8) as UcharArray8
  }
}
