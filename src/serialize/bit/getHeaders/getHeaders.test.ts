import { Char32 } from "../../common/char32"
import { Uint32Le } from "../../common/uint32Le"
import { VarInt } from "../../common/varInt"
import { GetHeaders } from "./getHeaders"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as crypto from "crypto"
import { abEq, concatArrayBufs } from "../../util"

const hash1 = crypto.randomBytes(32)
const hash2 = crypto.randomBytes(32)
const zeroHash = Buffer.alloc(32, 0)

const version = new Uint32Le(12345)
const hashCount = new VarInt(2)
const blHash1 = new Char32(hash1)
const blHash2 = new Char32(hash2)
const hashStop = new Char32(zeroHash)

const ab = concatArrayBufs([
  version.toBuffer(),
  hashCount.toBuffer(),
  blHash1.toBuffer(),
  blHash2.toBuffer(),
  hashStop.toBuffer(),
])

test("buffer to X to buffer", () => {
  const st = new ArrayBufferStream(ab)
  const x = GetHeaders.parse(st)
  expect(abEq(x.toBuffer(), ab)).toBeTruthy()
})

test("from buffer", () => {
  const st = new ArrayBufferStream(ab)
  const x = GetHeaders.parse(st)
  expect(x.version.n).toBe(12345)
  expect(x.hashCount.n).toBe(2)
  expect(x.blockLocatorHashes.length).toBe(2)
  expect(x.blockLocatorHashes[0].ua.buffer).toEqual(hash1.buffer)
  expect(x.blockLocatorHashes[1].ua.buffer).toEqual(hash2.buffer)
  expect(x.hashStop.ua.buffer).toEqual(zeroHash.buffer)
})

test("to buffer", () => {
  const getHeaders = new GetHeaders(
    version,
    hashCount,
    [blHash1, blHash2],
    hashStop,
  )
  const buf = getHeaders.toBuffer()
  expect(abEq(buf, ab)).toBeTruthy()
})

describe("gen_block_locator_indexes", () => {
  test("start height = 0", () => {
    const gh = GetHeaders.gen_block_locator_indexes(0)
    expect(gh.length).toBe(1)
    expect(gh[0]).toBe(0)
  })

  test("start height = 10", () => {
    const gh = GetHeaders.gen_block_locator_indexes(10)
    expect(gh.length).toBe(11)
    expect(gh).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0])
  })

  test("start height = 100", () => {
    const gh = GetHeaders.gen_block_locator_indexes(100)
    expect(gh.length).toBe(17)
    expect(gh).toEqual([100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 88, 84, 76, 60, 28, 0])
  })
})