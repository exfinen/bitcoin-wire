import { UcharArray } from "./ucharArray"
import { ArrayBufferStream } from "../arrayBufferStream"
import * as Assert from "assert"

export class UcharArray32 extends UcharArray {
  constructor(ab: ArrayBuffer) {
    super(ab)
    Assert.strictEqual(ab.byteLength, 32)
  }

  static parse(st: ArrayBufferStream): UcharArray32 | undefined {
    return UcharArray.parse(st, 32) as UcharArray32
  }
}
