import { useMoralis, useWeb3Contract } from 'react-moralis';
import { abi, contractAddress } from "../constants/export"
import { useEffect, useState } from 'react';
import { useNotification } from 'web3uikit'
import { ethers } from "ethers"
 
export default function () {

    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex);
    // console.log(chainId)
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null
    console.log("Address: " + raffleAddress)
    const [enteranceFee, setEnteranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState(0)
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()
    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        reRender()
    }

    const handleNewNotification = async () => {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell"
        })
    }

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "enterRaffle",
        msgValue: enteranceFee,
        params: {},
    })

    const { runContractFunction: getPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getRecentWinner",
        params: {},
    })

    async function reRender() {
        const fee = (await getEntranceFee()).toString()
        const winner = await getRecentWinner()
        const players = (await getPlayers()).toString()
        setEnteranceFee(fee)
        setNumPlayers(players)
        setRecentWinner(winner)
    }

    useEffect(
        () => {
            if (isWeb3Enabled)
                reRender()
        },
        [isWeb3Enabled]
    )

    return (
        <div className='p-7 font-bold whitespace-pre'>
            Wellcome to Lottery
            <br/>
            <br/>
            {
                raffleAddress
                    ?
                    <button 
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded ml-auto'
                    onClick={
                        async () => {

                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (err) => console.log(err)
                            })
                        }
                    }
                    disabled={isFetching || isLoading}
                    >
                        {
                            (isFetching || isFetching)
                            ?
                            (<div className='animate-spin spinner-border h-8 w-8 border-b-2 rounded-full '></div>)
                            :
                            (`Enter Raffle`)
                        
                        } 
                    </button>
                    : ``
            }
            <br />

            {
                raffleAddress
                    ?
                    `\nEntrance Fee is ${ethers.utils.formatUnits(enteranceFee)} Eth\nNumber of Players : ${numPlayers}\n${parseInt(recentWinner) == 0 ? `` : (`Recent Winner : ${recentWinner}`)}`
                    : 
                    `No Player Detected`
            }
        </div>
    )
}