import LotteryEnter from "../components/LotteryEnter"
import { NotificationProvider } from 'web3uikit'
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import '../styles/globals.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <Head>
      <title>Decentral Lottery</title>
        <link rel="shortcut icon" href="/fav1.ico" />
      </Head>
      <NotificationProvider>
        <Header />
        <LotteryEnter />
      </NotificationProvider>
    </MoralisProvider>
  )
}

export default MyApp 
