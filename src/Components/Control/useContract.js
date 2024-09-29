import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MasterChefABI from '../../assets/abi/MasterChef.json';

const useContract = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [pools, setPools] = useState([]);
  const [bonePerBlock, setBonePerBlock] = useState('');
  const [devAddress, setDevAddress] = useState('');
  const [pendingBone, setPendingBone] = useState(''); // State for pending BONE
  const [poolId, setPoolId] = useState(0); // Set your default pool ID
  const [amount, setAmount] = useState(''); // For deposits and withdrawals
  const [newPoolData, setNewPoolData] = useState({ allocPoint: '', lpToken: '', withUpdate: false });
  const [editPoolData, setEditPoolData] = useState({ pid: 0, allocPoint: '', withUpdate: false });
  const [multiplierNumber, setMultiplierNumber] = useState('');

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          const contractAddress = '0x4f79af8335d41A98386f09d79D19Ab1552d0b925';
          const masterChefContract = new ethers.Contract(contractAddress, MasterChefABI, signer);
          setContract(masterChefContract);

          fetchPoolLength(masterChefContract);
          fetchBonePerBlock(masterChefContract);
          fetchDevAddress(masterChefContract);
        } catch (error) {
          console.error('Failed to connect to wallet:', error);
        }
      } else {
        console.log('Please install MetaMask!');
      }
    };

    init();
  }, []);

  const fetchPoolLength = async (masterChefContract) => {
    if (masterChefContract) {
      try {
        const length = await masterChefContract.poolLength();
        const poolsData = await Promise.all(
          [...Array(length.toNumber()).keys()].map(async id => {
            const poolInfo = await masterChefContract.poolInfo(id);
            return { id, ...poolInfo };
          })
        );
        setPools(poolsData);
      } catch (error) {
        console.error('Error fetching pools:', error);
      }
    }
  };

  const fetchBonePerBlock = async (masterChefContract) => {
    if (masterChefContract) {
      try {
        const bone = await masterChefContract.bonePerBlock();
        setBonePerBlock(ethers.utils.formatEther(bone));
      } catch (error) {
        console.error('Error fetching bonePerBlock:', error);
      }
    }
  };

  const fetchDevAddress = async (masterChefContract) => {
    if (masterChefContract) {
      try {
        const address = await masterChefContract.devaddr();
        setDevAddress(address);
      } catch (error) {
        console.error('Error fetching dev address:', error);
      }
    }
  };

  const fetchPendingBone = async () => {
    if (contract && account) {
      try {
        const pending = await contract.pendingBone(poolId, account);
        setPendingBone(ethers.utils.formatEther(pending));
      } catch (error) {
        console.error('Error fetching pending BONE:', error);
      }
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchPendingBone();
      const interval = setInterval(fetchPendingBone, 30000);
      return () => clearInterval(interval);
    }
  }, [contract, account, poolId]);

  const handleDeposit = async () => {
    if (contract && amount) {
      try {
        const tx = await contract.deposit(poolId, ethers.utils.parseEther(amount));
        await tx.wait();
        console.log('Deposit successful');
        fetchPendingBone();
      } catch (error) {
        console.error('Error depositing:', error);
      }
    }
  };

  const handleWithdraw = async () => {
    if (contract && amount) {
      try {
        const tx = await contract.withdraw(poolId, ethers.utils.parseEther(amount));
        await tx.wait();
        console.log('Withdrawal successful');
        fetchPendingBone();
      } catch (error) {
        console.error('Error withdrawing:', error);
      }
    }
  };

  const handleAddPool = async () => {
    if (contract && newPoolData.allocPoint && newPoolData.lpToken) {
      try {
        const tx = await contract.add(
          newPoolData.allocPoint,
          newPoolData.lpToken,
          newPoolData.withUpdate
        );
        await tx.wait();
        console.log('Pool added successfully');
        fetchPoolLength(contract);
      } catch (error) {
        console.error('Error adding pool:', error);
      }
    }
  };

  const handleSetPool = async () => {
    if (contract && editPoolData.pid && editPoolData.allocPoint) {
      try {
        const tx = await contract.set(
          editPoolData.pid,
          editPoolData.allocPoint,
          editPoolData.withUpdate
        );
        await tx.wait();
        console.log('Pool updated successfully');
        fetchPoolLength(contract);
      } catch (error) {
        console.error('Error updating pool:', error);
      }
    }
  };

  const handleUpdateMultiplier = async () => {
    if (contract && multiplierNumber) {
      try {
        const tx = await contract.updateMultiplier(multiplierNumber);
        await tx.wait();
        console.log('Multiplier updated successfully');
      } catch (error) {
        console.error('Error updating multiplier:', error);
      }
    }
  };

  const handleUpdateDevAddress = async () => {
    if (contract && devAddress) {
      try {
        const tx = await contract.dev(devAddress);
        await tx.wait();
        console.log('Dev address updated successfully');
        fetchDevAddress(contract);
      } catch (error) {
        console.error('Error updating dev address:', error);
      }
    }
  };

  return {
    account,
    pools,
    bonePerBlock,
    devAddress,
    pendingBone,
    handleDeposit,
    handleWithdraw,
    handleAddPool,
    handleSetPool,
    handleUpdateMultiplier,
    handleUpdateDevAddress,
    setPoolId,
    setAmount,
    setNewPoolData,
    setEditPoolData,
    setMultiplierNumber,
  };
};

export default useContract;
