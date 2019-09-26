import { ArrayBufferStream } from "./arrayBufferStream"

test("taking 0", () => {
  const buf = new ArrayBuffer(0)
  const st = new ArrayBufferStream(buf)
  expect(st.take(0).byteLength).toBe(0)
})

test("empty buffer", () => {
  const buf = new ArrayBuffer(0)
  const st = new ArrayBufferStream(buf)

  expect(st.take(1)).toBeUndefined()
  expect(st.take(5)).toBeUndefined()
})

test("taking all at once from multiple inputs", () => {
  const buf1 = new ArrayBuffer(3)
  const ua1 = new Uint8Array(buf1)
  ua1.set([1,2,3], 0)

  const buf2 = new ArrayBuffer(2)
  const ua2 = new Uint8Array(buf2)
  ua2.set([4,5], 0)

  const st = new ArrayBufferStream(buf1, buf2)

  const res = st.take(5)
  const ua3 = new Uint8Array(res)

  expect(ua3[0]).toBe(1)
  expect(ua3[1]).toBe(2)
  expect(ua3[2]).toBe(3)
  expect(ua3[3]).toBe(4)
  expect(ua3[4]).toBe(5)
})

test("taking all at once", () => {
  const buf = new ArrayBuffer(3)
  const ua = new Uint8Array(buf)
  ua.set([1,2,3], 0)
  const st = new ArrayBufferStream(buf)

  const res = st.take(3)
  const ua2 = new Uint8Array(res)

  expect(ua2[0]).toBe(1)
  expect(ua2[1]).toBe(2)
  expect(ua2[2]).toBe(3)
})

test("taking all in 2 steps", () => {
  const buf = new ArrayBuffer(3)
  const ua0= new Uint8Array(buf)
  ua0.set([1,2,3], 0)
  const st = new ArrayBufferStream(buf)

  const res1 = st.take(1)
  const ua1 = new Uint8Array(res1)
  expect(ua1[0]).toBe(1)

  const res2 = st.take(2)
  const ua2 = new Uint8Array(res2)
  expect(ua2[0]).toBe(2)
  expect(ua2[1]).toBe(3)
})

test("taking more than the size in the 2nd step", () => {
  const buf = new ArrayBuffer(3)
  const ua0= new Uint8Array(buf)
  ua0.set([1,2,3], 0)
  const st = new ArrayBufferStream(buf)

  const res1 = st.take(1)
  const ua1 = new Uint8Array(res1)
  expect(ua1[0]).toBe(1)

  const res2 = st.take(3)
  expect(res2).toBeUndefined()
})