import * as util from "./util"

describe("concatArrayBufs", () => {
  function ab(xs: number[]) {
    const ab = new ArrayBuffer(xs.length)
    const ua = new Uint8Array(ab)
    ua.set(xs)
    return ua
  }

  function arrayOf(x: ArrayBuffer) {
    const ua = new Uint8Array(x)
    return Array.from(ua)
  }

  test("Empty input", () => {
    const x = util.concatArrayBufs([])
    expect(x.byteLength).toBe(0)
  })

  test("1 elem", () => {
    const x = util.concatArrayBufs([
      ab([1, 2]),
    ])
    expect(x.byteLength).toBe(2)
    expect(arrayOf(x)).toEqual([1, 2])
  })

  test("2 elems", () => {
    const x = util.concatArrayBufs([
      ab([1, 2]),
      ab([3]),
    ])
    expect(x.byteLength).toBe(3)
    expect(arrayOf(x)).toEqual([1, 2, 3])
  })

  test("2 elems w/ empty elem", () => {
    const x = util.concatArrayBufs([
      ab([1, 2]),
      ab([]),
    ])
    expect(x.byteLength).toBe(2)
    expect(arrayOf(x)).toEqual([1, 2])
  })
})

describe("arrayBuffersIdentical", () => {
  test("empty-empty", () => {
    const a = new ArrayBuffer(0)
    const b = new ArrayBuffer(0)
    expect(util.arrayBuffersIdentical(a, b)).toBeTruthy()
  })

  test("identical 2-2", () => {
    const a = new Uint8Array([1, 2]).buffer
    const b = new Uint8Array([1, 2]).buffer
    expect(util.arrayBuffersIdentical(a, b)).toBeTruthy()
  })

  test("non-identical 2-2", () => {
    const a = new Uint8Array([1, 3]).buffer
    const b = new Uint8Array([1, 2]).buffer
    expect(util.arrayBuffersIdentical(a, b)).toBeFalsy()
  })

  test("1-2", () => {
    const a = new Uint8Array([1]).buffer
    const b = new Uint8Array([1, 2]).buffer
    expect(util.arrayBuffersIdentical(a, b)).toBeFalsy()
  })
})

describe("ReverArrayBuffer", () => {
  test("empty", () => {
    const ab = new ArrayBuffer(0)
    util.reverseArrayBuffer(ab)
    expect(ab.byteLength).toBe(0)
  })

  test("1 element", () => {
    const ab = new Uint8Array([1])
    util.reverseArrayBuffer(ab)
    expect(ab.byteLength).toBe(1)
    expect(ab[0]).toBe(1)
  })

  test("2 elements", () => {
    let ua1 = new Uint8Array([1, 2])
    const ua2 = new Uint8Array(util.reverseArrayBuffer(ua1))
    expect(ua2.byteLength).toBe(2)
    expect(ua2[0]).toBe(2)
    expect(ua2[1]).toBe(1)
  })

  test("3 elements", () => {
    const ua1 = new Uint8Array([1, 2, 3])
    const ua2 = new Uint8Array(util.reverseArrayBuffer(ua1))
    expect(ua2.byteLength).toBe(3)
    expect(ua2[0]).toBe(3)
    expect(ua2[1]).toBe(2)
    expect(ua2[2]).toBe(1)
  })

  test("4 elements", () => {
    const ua1 = new Uint8Array([1, 2, 3, 4])
    const ua2 = new Uint8Array(util.reverseArrayBuffer(ua1))
    expect(ua2.byteLength).toBe(4)
    expect(ua2[0]).toBe(4)
    expect(ua2[1]).toBe(3)
    expect(ua2[2]).toBe(2)
    expect(ua2[3]).toBe(1)
  })

  test("5 elements", () => {
    const ua1 = new Uint8Array([1, 2, 3, 4, 5])
    const ua2 = new Uint8Array(util.reverseArrayBuffer(ua1))
    expect(ua2.byteLength).toBe(5)
    expect(ua2[0]).toBe(5)
    expect(ua2[1]).toBe(4)
    expect(ua2[2]).toBe(3)
    expect(ua2[3]).toBe(2)
    expect(ua2[4]).toBe(1)
  })
})