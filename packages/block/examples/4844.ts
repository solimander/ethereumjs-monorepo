import { Common, Chain, Hardfork } from '@ethereumjs/common'
import { Block } from '@ethereumjs/block'
import { BlobEIP4844Transaction } from '@ethereumjs/tx'
import { Address, initKZG } from '@ethereumjs/util'
import * as kzg from 'c-kzg'
import { randomBytes } from 'crypto'

const main = async () => {
  initKZG(kzg, __dirname + '/../../client/src/trustedSetups/official.txt')
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: {
      kzg,
    },
  })
  const blobTx = BlobEIP4844Transaction.fromTxData(
    { blobsData: ['myFirstBlob'], to: Address.fromPrivateKey(randomBytes(32)) },
    { common }
  )

  const block = Block.fromBlockData(
    {
      header: {
        excessBlobGas: 0n,
      },
      transactions: [blobTx],
    },
    {
      common,
      skipConsensusFormatValidation: true,
    }
  )

  console.log(
    `4844 block header with excessBlobGas=${block.header.excessBlobGas} created and ${
      block.transactions.filter((tx) => tx.type === 3).length
    } blob transactions`
  )
}

main()
