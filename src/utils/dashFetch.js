import { ethers } from 'ethers';
import BONE_ABI from '../assets/abi/BoneToken.json';
import { tokenContracts, routerAddress } from '../Components/Dash/Contracts';

export const getProvider = async () => {
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  throw new Error('No Ethereum wallet found');
};

export const getSigner = async (provider) => {
  return provider.getSigner();
};

export const fetchBalance = async (provider, address) => {
  try {
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
};

export const fetchTokenBalances = async (provider, walletAddress) => {
  try {
    const tokenBalances = await Promise.all(
      tokenContracts.map(async (token) => {
        const tokenContract = new ethers.Contract(token.address, ['function balanceOf(address) view returns (uint256)'], provider);
        const balance = await tokenContract.balanceOf(walletAddress);
        return {
          ...token,
          balance: ethers.utils.formatUnits(balance, token.decimals)
        };
      })
    );
    return tokenBalances;
  } catch (error) {
    console.error('Error fetching token balances:', error);
    throw error;
  }
};

export const fetchTransactions = async (provider, walletAddress) => {
  try {
    const latestBlock = await provider.getBlockNumber();
    const startBlock = latestBlock - 100;
    const txs = [];

    for (let i = latestBlock; i >= startBlock; i--) {
      const block = await provider.getBlockWithTransactions(i);
      const filteredTxs = block.transactions.filter(tx =>
        tx.from.toLowerCase() === walletAddress.toLowerCase() ||
        (tx.to && tx.to.toLowerCase() === walletAddress.toLowerCase())
      );
      txs.push(...filteredTxs);
      if (txs.length >= 25) break;
    }

    return txs;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const fetchVotingPower = async (provider, walletAddress) => {
  try {
    const boneToken = new ethers.Contract('0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF', BONE_ABI, provider);
    const votingPower = await boneToken.getCurrentVotes(walletAddress);
    const totalSupply = await boneToken.totalSupply();
    const votingPowerPercentage = (votingPower.mul(100).div(totalSupply)).toNumber() / 100;

    return {
      amount: ethers.utils.formatUnits(votingPower, 18),
      percentage: votingPowerPercentage.toFixed(2)
    };
  } catch (error) {
    console.error('Error fetching voting power:', error);
    throw error;
  }
};

export const fetchRouterTransactions = async (provider) => {
  try {
    const latestBlock = await provider.getBlockNumber();
    const startBlock = latestBlock - 100;
    const txs = [];

    for (let i = latestBlock; i >= startBlock; i--) {
      const block = await provider.getBlockWithTransactions(i);
      const filteredTxs = block.transactions.filter(tx =>
        tx.to && tx.to.toLowerCase() === routerAddress.toLowerCase()
      );
      txs.push(...filteredTxs);
      if (txs.length >= 10) break; // Limit to the latest 10 transactions
    }

    return txs;
  } catch (error) {
    console.error('Error fetching router transactions:', error);
    throw error;
  }
};