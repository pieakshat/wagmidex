'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export const DEX_ADDRESS = "0x80504fb095c623f0d33FE246c9D5f0c7Df6f1807";
export const ALICE_TOKEN_ADDRESS = "0x501d826490c6E34Abf4cde1Ac6E1091FdA8A8Cce"
export const BOB_TOKEN_ADDRESS = "0x15B956FA3948C9e0ac232d917CdB6F4BcDbd1dF1"

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
    </>
  )
}

export default App
