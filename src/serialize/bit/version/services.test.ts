import { Services, Service } from "./services"
import { ArrayBufferStream } from "../../arrayBufferStream"

test("buffer to X to buffer", () => {
})

describe("from buffer", () => {
  test("should handle NODE_NETWORK", () => {
    const buf = new ArrayBuffer(8)
    const dv = new DataView(buf)
    dv.setBigUint64(0, BigInt(Service.NODE_NETWORK), true)
    const x = Services.parse(new ArrayBufferStream(buf))
    expect(x).toBeDefined()
    expect(x.services).toBe(BigInt(Service.NODE_NETWORK))
  })
})

describe("to buffer", () => {
  test("should handle NODE_NETWORK", () => {
    const x = new Services(BigInt(Service.NODE_NETWORK))
    const buf = x.toBuffer()
    const dv = new DataView(buf)
    const services = dv.getBigUint64(0, true)
    expect(services).toBe(BigInt(Service.NODE_NETWORK))
  })
})