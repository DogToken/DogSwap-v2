import { ethers } from 'ethers';
import axios from 'axios';
import pairABI from "./../assets/abi/IUniswapV2Pair.json";

const POOLS = [
  { id: 0, name: "$BONE-WMINT", address: "0x21D897515b2C4393F7a23BBa210b271D13CCdF10" },
  { id: 1, name: "$BONE-USDC", address: "0x0BA7216BD34CAF32d1FBCb9341997328b38a03a3" },
  { id: 2, name: "WMINT-USDC", address: "0x1Ea95048A66455C3852dBE4620A3970831564189" },
  { id: 3, name: "WMINT-DOGSP", address: "0x07Da7DA47b3C71a023d194ff623ab3a737c46393" },
  { id: 5, name: "$BONE-DOGSP", address: "0xCfFF901398cB001D740FFf564D2dcc9Dbd898a11" },
];
const BONE_TOKEN_DECIMALS = 18;

export const getBonePriceInMintMe = async () => {
  const provider = new ethers.providers.JsonRpcProvider("https://node.1000x.ch");
  const bonePool = POOLS.find(pool => pool.name === "$BONE-WMINT");
  const boneReserves = await new ethers.Contract(bonePool.address, pairABI, provider).getReserves();
  const boneReserve0 = boneReserves[0] / 10 ** BONE_TOKEN_DECIMALS;
  const boneReserve1 = boneReserves[1] / 10 ** 18;
  const boneInWMINT = boneReserve1 / boneReserve0;
  const bonePriceInMintMe = 1 / boneInWMINT;
  return parseFloat(bonePriceInMintMe).toFixed(8);
};

export const getBonePriceInUSD = async (mintmePriceInUSD) => {
  const bonePriceInMintMe = await getBonePriceInMintMe();
  return (bonePriceInMintMe * mintmePriceInUSD).toFixed(4);
};