import { MsgHeader } from "./msgHeader"
import { ArrayBufferStream } from "../../arrayBufferStream"
import { Magic } from "./magic"
import { Command } from "./command"
import { Uint32Le } from "../../common/uint32Le"
import { Checksum } from "./checksum"
import { abEq, concatArrayBufs } from "../../util"

/*
4  magic uint32
12 command char[12]
4  length  uint32 le
4  checksum uint32
?  payload uchar[]
*/
const magic = new Magic("main")
const command = new Command("version")
const length = new Uint32Le(123)
const checksum = new Checksum(new Uint8Array([1,2,3,4]).buffer)

const ab = concatArrayBufs([
  magic.toBuffer(),
  command.toBuffer(),
  length.toBuffer(),
  checksum.toBuffer(),
])

test("buffer to X to buffer", () => {
  const x = MsgHeader.parse(new ArrayBufferStream(ab))
  expect(abEq(x.toBuffer(), ab)).toBeTruthy()
})

test("from buffer", () => {
  const x = MsgHeader.parse(new ArrayBufferStream(ab))
  expect(x).toBeDefined()
  expect(x.magic.network).toBe(magic.network)
  expect(x.command.name).toBe(command.name)
  expect(x.length.n).toBe(length.n)
  expect(x.checksum.v).toEqual(checksum.v)
})

test("to buffer", () => {
  const x = new MsgHeader(magic, command, length, checksum)
  const buf = x.toBuffer()

  const pMagic = Magic.parse(new ArrayBufferStream(buf.slice(0, 4)))
  expect(pMagic.network).toBe(magic.network)

  const pCommand = Command.parse(new ArrayBufferStream(buf.slice(4, 16)))
  expect(command.name).toBe(pCommand.name)

  const pLength = Uint32Le.parse(new ArrayBufferStream(buf.slice(16, 20)))
  expect(length.n).toBe(pLength.n)

  const pChecksum = Checksum.parse(new ArrayBufferStream(buf.slice(20, 24)))
  expect(pChecksum.v).toEqual(checksum.v)
})