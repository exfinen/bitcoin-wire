# Bitcoin wire

TypeScript implementation of Bitcoin wire protocol de/serializers

Inlcudes Block and the child de/serializers and commands required to do initial handshake.
Tx de/serializer can generate TxId.

## Usage

```
// Serialization
const inBuf = Buffer.from("02000000....", "hex")
const st = new ArrayBufferStream(inBuf)
const block = Block.parse(st)

// Deserialization
const outBuf = block.toBuffer()
```
