import * as util from "./util"

export abstract class Parser {
  abstract toBuffer(): ArrayBuffer

  parsers2Buffer(parsers: (Parser | undefined)[]): ArrayBuffer {
    const bufs = parsers.reduce((acc, x) => {
      if (x) { acc.push(x.toBuffer()) }
      return acc
    }, [])
    return util.concatArrayBufs(bufs)
  }
}