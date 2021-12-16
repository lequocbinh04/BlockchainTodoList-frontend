import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/Image";
import styles from "../styles/Home.module.css";
import getWeb3 from "../utils/getWeb3";
import { useState, useEffect } from "react";
import Web3 from "web3";

import ToDoListContract from "../contracts/ToDoList.json";

const connectMetaMask = async () => {
    const web3 = await getWeb3();
    const chainId = await web3.eth.getChainId();
    if (chainId !== 97) {
        alert("Unknown network, please change network to BSC Testnet");
        return;
    }
};

const Home: NextPage = () => {
    const [address, setAddress] = useState("Not connected");
    const [countNote, setCountNote] = useState("Loading...");
    const [note, setNote] = useState([]);
    const [txt, setTxt] = useState("");
    useEffect(() => {
        const init: any = async () => {
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                console.log("Logged in");
                setAddress(accounts[0]);
            } else {
                console.log("User not logged in");
            }
            if (address == "Not connected") return;
            const networkId = 97;
            let addressContract = ToDoListContract.networks[networkId].address;
            let mainContract = new web3.eth.Contract(
                ToDoListContract.abi,
                addressContract,
                {
                    transactionConfirmationBlocks: 1,
                }
            );
            let x = await mainContract.methods
                .countNote()
                .call({ from: address });
            setCountNote(x);
            console.log(address);
            x = await mainContract.methods.getNote().call({ from: address });
            setNote(x);
            console.log(x);
        };
        init();
    }, [address]);

    const handleSubmit = async () => {
        const web3 = new Web3(window.ethereum);
        const networkId = 97;
        let addressContract = ToDoListContract.networks[networkId].address;
        let mainContract = new web3.eth.Contract(
            ToDoListContract.abi,
            addressContract,
            {
                transactionConfirmationBlocks: 1,
            }
        );
        // let x = await mainContract.methods.changeLimit(parseInt(txt)).send({
        //     from: address,
        // });
        let x = await mainContract.methods.saveNote(txt).send({
            from: address,
        });
        console.log(x);
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Blockchain Todolist with Smart Chain Testnet</title>
                <meta
                    name="description"
                    content="Blockchain Todolist with Smart Chain Testnet"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div
                className="flex flex-col items-center mt-12"
                style={{
                    height: "100vh",
                }}
            >
                <div className="flex items-center">
                    <Image
                        src="/assets/images/logo.png"
                        alt=""
                        width="50"
                        height="50"
                        className="rounded-xl"
                    />
                    <h1 className="ml-3 text-red-600 font-semibold text-2xl">
                        Blockchain TodoList
                    </h1>
                </div>
                <div className="mt-8 bg-red-300 outline-dashed outline-2 outline-offset-4 outline-red-600 rounded-2xl text-black px-8 py-4">
                    Your account address: {address}
                </div>
                {address == "Not connected" ? (
                    <button
                        onClick={() => {
                            connectMetaMask();
                        }}
                        className="mt-8 flex items-center bg-blue-600 text-white px-8 py-4 rounded-md"
                        style={{
                            clipPath:
                                "polygon(8% 0, 95% 0, 100% 25%, 92% 100%, 5% 100%, 0 75%)",
                        }}
                    >
                        <Image
                            alt=""
                            src="/assets/images/metamask.svg"
                            width="30"
                            height="30"
                        />
                        <span className="ml-4">Connect metamask</span>
                    </button>
                ) : null}

                <div>
                    <div>
                        <input
                            type="text"
                            placeholder="Nhập ghi chú"
                            className="px-8 py-6 bg-gray-100 rounded-2xl focus:outline-2 focus:outline-offset-8 mt-8"
                            style={{
                                width: 400,
                            }}
                            value={txt}
                            onChange={(e) => setTxt(e.target.value)}
                        />
                        <button
                            type="text"
                            placeholder="Nhập việc cần làm"
                            className="px-8 py-5 bg-red-500 ml-6 text-lg text-white rounded-2xl focus:outline-2 focus:outline-offset-8 mt-8"
                            onClick={handleSubmit}
                        >
                            Thêm việc cần làm
                        </button>
                    </div>
                    <p className="mt-8">Số việc cần làm: {countNote}</p>
                    <div className="mt-8">
                        {note.map((data, i) => (
                            <div
                                key={i}
                                className="mt-4 bg-red-300 rounded-2xl text-black px-8 py-4"
                            >
                                {data}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
