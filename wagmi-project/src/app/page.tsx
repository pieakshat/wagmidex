'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export const DEX_ADDRESS = "0x7359ea4f7945F31944670746DF3369Da500D0733";
export const ALICE_TOKEN_ADDRESS = "0xaF79D44FC4196B7879829f1cF9867E9569b2A5e2"
export const BOB_TOKEN_ADDRESS = "0x082624a2345d8dc4B91d3F23bdd7c1bf06f7268B"

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
