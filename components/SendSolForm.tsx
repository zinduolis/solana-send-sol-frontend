import { FC } from 'react'
import * as Web3 from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import styles from '../styles/Home.module.css'


export const SendSolForm: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet()

    const sendSol = async (event) => {
        event.preventDefault();

        if (!connection || !publicKey) { return }

        const receiver = new Web3.PublicKey(event.target.recipient.value);
        const transaction = new Web3.Transaction();
        const instruction = Web3.SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: receiver,
                lamports: Web3.LAMPORTS_PER_SOL * event.target.amount.value,
        });
        transaction.add(instruction);
       sendTransaction(transaction, connection).then(sig => {
        console.log(
            `Transfer tx: https://explorer.solana.com/tx/${sig}?cluster=devnet`
        )
        console.log(`Sent ${event.target.amount.value} SOL to ${event.target.recipient.value}`)
       });    
    }

    return (
        <div>
            <form onSubmit={sendSol} className={styles.form}>
                <label htmlFor="amount">Amount (in SOL) to send:</label>
                <input id="amount" type="text" className={styles.formField} placeholder="e.g. 0.1" required />
                <br />
                <label htmlFor="recipient">Send SOL to:</label>
                <input id="recipient" type="text" className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                <button type="submit" className={styles.formButton}>Send</button>
            </form>
        </div>
    )
}