import * as chains from './chains';

// If you add coins for a new network, make sure Weth address (for the router you are using) is the first entry

const MINTMECoins = [
  {
    name: "MintMe",
    abbr: "MINTME",
    address: "", 
    logoUrl: "https://dogswap.xyz/images/coins/mintme.png",
  },
  {
    name: "DogSwap",
    abbr: "DogSwap",
    address: "0x1628160C66e0330090248a163A34Ba5B5A82D4f7",
    logoUrl: "https://dogswap.xyz/images/coins/dogswap.png",
  },
  {
    name: "Bone",
    abbr: "BONE",
    address: "0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF",
    logoUrl: "https://dogswap.xyz/images/coins/bone.png",
  },
  {
    name: "1000x",
    abbr: "1000X",
    address: "0x7b535379bBAfD9cD12b35D91aDdAbF617Df902B2",
    logoUrl: "https://dogswap.xyz/images/coins/1000x.png",
  },
  {
    name: "Peppermint",
    abbr: "PMINT",
    address: "0xe67f14Fa595947bd63546866a1FCCf27E2D58203",
    logoUrl: "https://dogswap.xyz/images/coins/peppermint.png",
  },
  {
    name: "XatteR",
    abbr: "XatteR",
    address: "0xB580f1dbA1c17882Fca8f6DDadA8428c9cB177fC",
    logoUrl: "https://dogswap.xyz/images/coins/xatter.png",
  },
  {
    name: "Ranger",
    abbr: "Ranger",
    address: "0x5Fed7eb4B29e9B2E2758AC40C9ec4B4E67098192",
    logoUrl: "https://dogswap.xyz/images/coins/ranger.png",
  },
  {
    name: "Dance And Music",
    abbr: "Dance And Music",
    address: "0x381911b21E0Cd8C3F4A57B332adCcfC0a64E26c5",
    logoUrl: "https://dogswap.xyz/images/coins/DAM.png",
  },
  {
    name: "BANG",
    abbr: "BANG",
    address: "0xf8402c9E3218588EeEBb0CC08a01E841242bdEe0",
    logoUrl: "https://dogswap.xyz/images/coins/BANG.png",
  },
  {
    name: "Zarali",
    abbr: "Zarali",
    address: "0xa88bCa314ebe9301cBa3b4C718149b05D4AD0ea5",
    logoUrl: "https://dogswap.xyz/images/coins/zarali.png",
  },
  {
    name: "D Club",
    abbr: "D Club",
    address: "0x7457a49688E2D7a2067694f687Ff87A3D10008B3",
    logoUrl: "https://dogswap.xyz/images/coins/dclub.png",
  },
  {
    name: "Shells",
    abbr: "Shells",
    address: "0xaa153Ce997E1363cb31231e644c4266d9C954630",
    logoUrl: "https://dogswap.xyz/images/coins/shells.jpeg",
  },
  {
    name: "Anukis",
    abbr: "Anukis",
    address: "0xfcC19E279D0240cFdaBdEEB6885f6829FCCfa501",
    logoUrl: "https://dogswap.xyz/images/coins/anukis.png",
  },
  {
    name: "MintMeBull",
    abbr: "MintMe Bull",
    address: "0xd5c9BFF69210129764DEFEc86bD7e239dD2cE844",
    logoUrl: "https://dogswap.xyz/images/coins/mintmebull.png",
  },
  {
    name: "Prunity",
    abbr: "Prunity",
    address: "0x78CF733E6e113BA393b3bd17E4738E4dd63366fb",
    logoUrl: "https://dogswap.xyz/images/coins/prunity.png",
  },
  {
    name: "TREE",
    abbr: "TREE",
    address: "0x69a3eDdB6bE2d56E668E7DfF68DB1303e675A0F0",
    logoUrl: "https://dogswap.xyz/images/coins/tree.jpeg",
  },
  {
    name: "bobdubbloon",
    abbr: "bobdubbloon",
    address: "0x2f9C7A6ff391d0b6D5105F8e37F2050649482c75",
    logoUrl: "https://dogswap.xyz/images/coins/bobdub.jpeg",
  },
  {
    name: "BitMonky",
    abbr: "BitMonky",
    address: "0x3Eb5Ea03039450621500a7481525494c33d2aa0A",
    logoUrl: "https://dogswap.xyz/images/coins/bitmonky.png",
  },
  {
    name: "Donatello",
    abbr: "Donatello",
    address: "0x4F83B8D128d745a888Aff17c332056c6455e5079",
    logoUrl: "https://dogswap.xyz/images/coins/donatello.webp",
  },
  {
    name: "WhaleBux",
    abbr: "WhaleBux",
    address: "0x9F04568f8da1f7aB663f237cD672e408fBa4763e",
    logoUrl: "https://dogswap.xyz/images/coins/WBUX.png",
  },
  {
    name: "MineMintToken",
    abbr: "MineMintToken",
    address: "0xA27c1AbD15bfFAAde6c2e873C10fc7a2beb72d69",
    logoUrl: "https://dogswap.xyz/images/coins/mineminttoken.png",
  },
  {
    name: "BaTs",
    abbr: "BaTs",
    address: "0xe0358c483b65cfb60760875d11b2fa2f8421859e",
    logoUrl: "https://dogswap.xyz/images/coins/BaTs.png",
  },
  {
    name: "VecX",
    abbr: "VecX",
    address: "0x92bb7892c9dd0cfb87701eee940f8e69835bdbd4",
    logoUrl: "https://dogswap.xyz/images/coins/vecx.png",
  },
  {
    name: "SE31",
    abbr: "SE31",
    address: "0xb3eea81b9190892aa89244876059dd6e1456eaea",
    logoUrl: "https://dogswap.xyz/images/coins/se31.png",
  },
  {
    name: "Donatello Club",
    abbr: "Donatello Club",
    address: "0x7FCB10DAD376c44e96a73f8fBAB0617C788d717C",
    logoUrl: "https://dogswap.xyz/images/coins/donclub.png",
  },
  {
    name: "ULTRA-9",
    abbr: "ULTRA-9",
    address: "0xb5de1ee82f95583236468750977daf932979d70f",
    logoUrl: "https://dogswap.xyz/images/coins/ultra.png",
  },
  {
    name: "BOUNTY",
    abbr: "BOUNTY",
    address: "0xA08D7bc9CD6fCF0Bb80c993c61cAeF02e3E61FC0",
    logoUrl: "https://dogswap.xyz/images/coins/bounty.png",
  },
  {
    name: "HealthCred",
    abbr: "HealthCred",
    address: "0x4a716d91ce3e1f5ded10df77b8b21b37c8064b25",
    logoUrl: "https://dogswap.xyz/images/coins/healthcred.jpeg",
  },
  {
    name: "KRMR",
    abbr: "KRMR",
    address: "0xa2d8824bb755b256fd23de2c5074c890360a1e5a",
    logoUrl: "https://dogswap.xyz/images/coins/krmr.jpeg",
  },
  {
    name: "DURP",
    abbr: "DURP",
    address: "0x18c21d9c94abdc7daf50aec23f3110b51a5836a7",
    logoUrl: "https://dogswap.xyz/images/coins/durp.webp",
  },
  {
    name: "NINJA",
    abbr: "NINJA",
    address: "0x1675ef80090e4d9cd648e0debe41a7a8b7ecf4ef",
    logoUrl: "https://dogswap.xyz/images/coins/ninja.webp",
  },
  {
    name: "MintMoXMR",
    abbr: "MintMoXMR",
    address: "0x3AD09254A2406B6CDf2b184479EaC284E99A72D3",
    logoUrl: "https://dogswap.xyz/images/coins/mintmoxmr.png",
  },
  {
    name: "SMILE",
    abbr: "SMILE",
    address: "0xe5a65FE59B03301C2409c6C5aDe432F44fa1eD0c",
    logoUrl: "https://dogswap.xyz/images/coins/smile.png",
  },
  {
    name: "Zenny",
    abbr: "Zenny",
    address: "0xe7D8B46047d55902982CeD9D37eE85A63B991a1a",
    logoUrl: "https://dogswap.xyz/images/coins/zenny.jpeg",
  },
  {
    name: "10K Litoshi",
    abbr: "10K Litoshi",
    address: "0x02d0E745f6A5BCC5216E63E12249e08514CcFfE4",
    logoUrl: "https://dogswap.xyz/images/coins/10klitoshi.png",
  },
  {
    name: "MLM",
    abbr: "MLM",
    address: "0xAf0589ce275Bff00a6C71E70Cc4187B7B6894306",
    logoUrl: "https://dogswap.xyz/images/coins/mlm.jpeg",
  },
]

const COINS = new Map();
COINS.set(chains.ChainId.MINTME, MINTMECoins);
export default COINS
