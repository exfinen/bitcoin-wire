import { NetAddr } from "./netAddr"
import { ArrayBufferStream } from "../../arrayBufferStream"
import { Uint32Le } from "../../common/uint32Le"
import { Services, Service } from "./services"
import { IpV6_4 } from "./ipV6_4"
import { Uint16Be } from "../../common/uint16Be"

test("buffer to X to buffer", () => {
})

describe("from buffer", () => {
  test("including time", () => {
    const time = new Uint32Le(12345)
    const services = new Services(BigInt(Service.NODE_NETWORK))
    const ipV4 = new IpV6_4([10, 24, 3, 109])
    const port = new Uint16Be(8090)

    const st = new ArrayBufferStream(
      time.toBuffer(),
      services.toBuffer(),
      ipV4.toBuffer(),
      port.toBuffer(),
    )
    const x = NetAddr.parse(st, true)
    expect(x).toBeDefined()
    expect(x.time.n).toBe(12345)
    expect(x.services.services).toBe(BigInt(Service.NODE_NETWORK))
    expect(x.ipV4.octets).toEqual([10, 24, 3, 109])
    expect(x.port.n).toBe(8090)
  })

  test("excluding time", () => {
    const services = new Services(BigInt(Service.NODE_NETWORK))
    const ipV4 = new IpV6_4([10, 24, 3, 109])
    const port = new Uint16Be(8090)

    const st = new ArrayBufferStream(
      services.toBuffer(),
      ipV4.toBuffer(),
      port.toBuffer(),
    )
    const x = NetAddr.parse(st, false)
    expect(x).toBeDefined()
    expect(x.services.services).toBe(BigInt(Service.NODE_NETWORK))
    expect(x.ipV4.octets).toEqual([10, 24, 3, 109])
    expect(x.port.n).toBe(8090)
  })
})

describe("to buffer", () => {
  test("including time", () => {
    const time = new Uint32Le(12345)
    const services = new Services(BigInt(Service.NODE_NETWORK))
    const ipV4 = new IpV6_4([10, 24, 3, 109])
    const port = new Uint16Be(8090)

    const x = new NetAddr(services, ipV4, port, time)
    const buf = x.toBuffer()

    // time
    const dvTime = new DataView(buf, 0, 4)
    expect(dvTime.getUint32(0, true)).toBe(12345)

    // services
    const dvSvc = new DataView(buf, 4, 8)
    expect(dvSvc.getBigUint64(0, true)).toBe(BigInt(Service.NODE_NETWORK))

    // ipV4
    const uaIpV4 = new Uint8Array(buf, 12, 16)
    for(let i=0; i<10; ++i) {
      expect(uaIpV4[i]).toBe(0)
    }
    expect(uaIpV4[10]).toBe(0xff)
    expect(uaIpV4[11]).toBe(0xff)
    expect(uaIpV4[12]).toBe(10)
    expect(uaIpV4[13]).toBe(24)
    expect(uaIpV4[14]).toBe(3)
    expect(uaIpV4[15]).toBe(109)

    // port
    const dvPort = new DataView(buf, 28, 2)
    expect(dvPort.getUint16(0, false)).toBe(8090)
})

test("excluding time", () => {
  const services = new Services(BigInt(Service.NODE_NETWORK))
  const ipV4 = new IpV6_4([10, 24, 3, 109])
  const port = new Uint16Be(8090)

  const x = new NetAddr(services, ipV4, port)
  const buf = x.toBuffer()

  // services
  const dvSvc = new DataView(buf, 0, 8)
  expect(dvSvc.getBigUint64(0, true)).toBe(BigInt(Service.NODE_NETWORK))

  // ipV4
  const uaIpV4 = new Uint8Array(buf, 8, 16)
  for(let i=0; i<10; ++i) {
    expect(uaIpV4[i]).toBe(0)
  }
  expect(uaIpV4[10]).toBe(0xff)
  expect(uaIpV4[11]).toBe(0xff)
  expect(uaIpV4[12]).toBe(10)
  expect(uaIpV4[13]).toBe(24)
  expect(uaIpV4[14]).toBe(3)
  expect(uaIpV4[15]).toBe(109)

  // port
  const dvPort = new DataView(buf, 24, 2)
  expect(dvPort.getUint16(0, false)).toBe(8090)
  })
})