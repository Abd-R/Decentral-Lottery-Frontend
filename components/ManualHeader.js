import { useMoralis } from 'react-moralis';
import { useEffect } from 'react';

export default function ManualHeader() {
    // hook
    const { enableWeb3, deactivateWeb3, account, isWeb3Enabled, Moralis, isWeb3EnableLoading } = useMoralis()
    useEffect(
        () => {
            /**
             * it will re render every time isWeb3Enabled is changed
             * if [] is not passed, it will re render, everytime anything 
             * is re rendered
             */
            if (isWeb3Enabled) return
            if (window.localStorage.getItem("connected"))
                enableWeb3();
        },
        [isWeb3Enabled]
    )
    useEffect(
        () => {
            Moralis.onAccountChanged(account => {
                if (!account) {
                    window.localStorage.removeItem("connected")
                    deactivateWeb3();
                    console.log("Null accounts")
                }
            })
        },
        []
    )
    return (
        <div>
            {
                account ?
                    <div>Connected to {account}!</div> :
                    <button onClick={
                        async () => {
                            console.log("Connecting to Wallet")
                            await enableWeb3();
                            window.localStorage.setItem("connected", "injected")
                        }
                    } disabled={isWeb3EnableLoading}>
                        Connect
                    </button>
            }
        </div>
    )
}