import { useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { MoodNftAbi } from "./abi";
import { config } from "./wagmiConfig.ts";
import { watchContractEvent } from "@wagmi/core";

import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const { writeContractAsync } = useWriteContract();
  const [tokenCounter, settokenCounter] = useState<any>();

  const [loading, setLoading] = useState(false);

  const CONTRACT_ADDRESS = "0x2dd2103B747Ec9EbfC0Ca6D5D8D740e874c177dF";
  const [image, setImage] = useState<string>("");
  console.log(MoodNftAbi, typeof MoodNftAbi);

  const { data: counter } = useReadContract({
    abi: MoodNftAbi,
    address: CONTRACT_ADDRESS,
    functionName: "getTokenCounter",
  });

  const { data: tokenURI } = useReadContract({
    abi: MoodNftAbi,
    address: CONTRACT_ADDRESS,
    functionName: "tokenURI",
    args: [counter],
  });

  useEffect(() => {
    const unwatch = watchContractEvent(config, {
      address: CONTRACT_ADDRESS,
      abi: MoodNftAbi,
      eventName: "NftMinted",
      onLogs(logs: any) {
        console.log("New logs!", logs);
      },
    });

    return () => {
      unwatch();
    };
  }, [CONTRACT_ADDRESS]);

  useEffect(() => {
    (async () => {
      if (tokenURI) {
        const res = await (await fetch(tokenURI as unknown as string)).json();
        setImage(res.image);
        settokenCounter(counter);
      }
    })();
  }, [tokenURI]);

  return (
    <div className="mx-auto max-w-5xl ">
      <div className="flex justify-end">
        <w3m-button />
      </div>
      {image ? (
        <img
          className="text-black mx-auto w-80 h-80 "
          src={image}
          alt="a NFT to mint"
          width={400}
          height={400}
        />
      ) : (
        <p>Connect wallet to show NFT</p>
      )}
      <button
        className=" bg-[#526BEA]"
        onClick={async () => {
          try {
            setLoading(true);
            const tx = await writeContractAsync({
              abi: MoodNftAbi,
              functionName: "mint",
              address: CONTRACT_ADDRESS,
            });

            console.log(tx);
            setMessage("NFT minted successfully 🎉");
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        }}
      >
        {!loading ? "Mint ✨" : "Wait.."}
      </button>
      <p className="max-w-xl mx-auto mt-10">
        This is a dynamic Nft, that is 100% on chain and depends on the owners
        mood, NFT is sad minting will make it happy
      </p>
      {tokenCounter && <p className="mt-10">{`${tokenCounter} NFT minted`} </p>}
      {message && (
        <div>
          <p>{message}</p>
          <p className="mt-10">
            Check out you minted NFT at:{" "}
            <a
              className="text-blue-700 underline"
              href={`https://testnets.opensea.io/assets/sepolia/${CONTRACT_ADDRESS}/${counter}`}
            >
              OpenSea
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
