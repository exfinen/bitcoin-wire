import { Parser } from "../../parser"
import { ArrayBufferStream } from "../../arrayBufferStream"
import * as util from "../../util"

export type Network = "main" | "testnet" | "testnet3"

interface Network2Magic {
  network: Network,
  magic: number[],
}

export class Magic extends Parser {
  network: Network

  static readonly n2ms: Network2Magic[] = [
    {
      network: "main",
      magic: [0xf9, 0xbe, 0xb4, 0xd9],
    },
    {
      network: "testnet",
      magic: [0xfa, 0xbf, 0xb5, 0xda],
    },
    {
      network: "testnet3",
      magic: [0x0b, 0x11, 0x09, 0x07],
    },
  ]

  constructor(network: Network) {
    super()
    this.network = network
  }

  toBuffer(): ArrayBuffer {
    const n2m = this.findN2mByNetwork(this.network)
    return new Uint8Array(n2m.magic).buffer
  }

  private findN2mByNetwork(network: Network): Network2Magic | never {
    for(const n2m of Magic.n2ms) {
      if (n2m.network === network) {
        return n2m
      }
    }
  }

  private static findN2mByMagic(xs: number[]): Network2Magic | undefined {
    for(const n2m of Magic.n2ms) {
      if (xs[0] === n2m.magic[0] &&
        xs[1] === n2m.magic[1] &&
        xs[2] === n2m.magic[2] &&
        xs[3] === n2m.magic[3]
      ) {
        return n2m
      }
    }
    return undefined
  }

  static parse(st: ArrayBufferStream): Magic | undefined {
    return util.tryParse("Magic", () => {
      const buf = st.take(4)
      if (!buf) {
        return undefined
      }
      const xs = Array.from(new Uint8Array(buf))
      const n2m = Magic.findN2mByMagic(xs)
      if (!n2m) {
        return undefined
      }
      return new Magic(n2m.network)
    })
  }
}



