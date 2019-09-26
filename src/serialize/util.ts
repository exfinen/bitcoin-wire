import { StringDecoder } from "string_decoder"
import * as crypto from "crypto"
import { VarInt } from "./common/varInt"
import { UcharArray } from "./common/ucharArray"

export function arrayBuffer2Buffer(ab: ArrayBuffer): Buffer {
  const buf = Buffer.alloc(ab.byteLength)
  const ua = new Uint8Array(ab)
  for(let i=0; i<ua.length; ++i) {
    buf[i] = ua[i]
  }
  return buf
}

const strDec = new StringDecoder()

export function arrayBuffer2Str(ab: ArrayBuffer): string {
  const buf = arrayBuffer2Buffer(ab)
  const ua = new Uint8Array(buf)
  // if string is null-terminated, make that to be the stirng length
  let length = ua.length
  for(let i=0; i<ua.length; ++i) {
    if (ua[i] === 0) {
      length = i
      break
    }
  }
  return strDec.write(buf.slice(0, length))
}

export function uint8Array2Buffer(ua: Uint8Array): Buffer {
  const buf = Buffer.alloc(ua.length)
  for(let i=0; i<ua.length; ++i) {
    buf[i] = ua[i]
  }
  return buf
}

export function concatArrayBufs(abs: ArrayBuffer[]): ArrayBuffer {
  // convert ArrayBuffer[] to Uint8Array[] while calculating total length ignoring undefined elems
  const [uas, totalLen] = abs.reduce(([uas, totalLen], ab) => {
    if (ab) {
      const ua = new Uint8Array(ab)
      uas.push(ua)
      return [uas, totalLen + ab.byteLength]
    } else {
      return [uas, totalLen]
    }
  }, [[], 0])

  // allocate new ArrayBuffer to hold concatenated ArrayBuffers
  const concatAb = new ArrayBuffer(totalLen)
  const concatUa = new Uint8Array(concatAb)

  // write ArrayBuffers to the new ArrayBuffer
  uas.reduce((insertIdx, ua) => {
    concatUa.set(ua, insertIdx)
    return insertIdx + ua.length
  }, 0)

  return concatAb
}

export const abEq = arrayBuffersIdentical

export function len(ab: ArrayBuffer): number {
  const dv = new DataView(ab)
  return dv.getUint8(0)
}

export function len4u(ab: ArrayBuffer): number {
  const dv = new DataView(ab)
  return dv.getUint32(0, true)
}

export function len4(ab: ArrayBuffer): number {
  const dv = new DataView(ab)
  return dv.getInt32(0, true)
}

export function compUa(buf: ArrayBuffer, p: number, sizeVi: VarInt, ua: UcharArray): number {
  const size = sizeVi.n as number
  expect(len(buf.slice(p, p + 1))).toBe(size)
  p += 1
  expect(abEq(buf.slice(p, p + size), ua.ab))
  p += size
  return p
}

export function sha256(buf: ArrayBuffer): ArrayBuffer {
  const h = crypto.createHash('sha256')
  h.update(new Uint8Array(buf))
  return h.digest()
}

export function calcChecksum(buf: ArrayBuffer): ArrayBuffer {
  return sha256(sha256(buf)).slice(0, 4)
}

export function arrayBuffersIdentical(ab1: ArrayBuffer, ab2: ArrayBuffer): boolean {
  const ua1 = new Uint8Array(ab1)
  const ua2 = new Uint8Array(ab2)

  if (ua1.length !== ua2.length) {
    return false
  }
  for(let i=0; i<ua1.length; ++i) {
    if (ua1[i] !== ua2[i]) {
      return false
    }
  }
  return true
}

export function tryParse<T>(name: string, f: () => T | undefined): T | undefined {
  try {
    return f()
  } catch(error) {
    console.error(`Failed to parse ${name}: ${error}`)
    return undefined
  }
}

export function flatten<T>(xs: T[][]): T[] {
  const nxs = []
  for(const x of xs) {
    nxs.push(...x)
  }
  return nxs
}

export function reverseArrayBuffer(ab: ArrayBuffer): ArrayBuffer {
  const ua = new Uint8Array(ab)
  let tmp: number

  let s = 0
  let e = ua.length - 1

  while(s < e) {
    tmp = ua[s]
    ua[s] = ua[e]
    ua[e] = tmp
    s++
    e--
  }
  return ua
}

export function filledBuf(size: number, from: number = 0): Uint8Array {
  const ab = new ArrayBuffer(size)
  const ua = new Uint8Array(ab)

  for(let i=from; i<size; ++i) {
    ua[i] = i
  }
  return ua
}

export function filledBufValid(ab: ArrayBuffer, size: number, from: number = 0) {
  expect(ab.byteLength).toBe(size)
  const ua = new Uint8Array(ab)

  for(let i=from; i<size; ++i) {
    expect(ua[i]).toBe(i)
  }
}