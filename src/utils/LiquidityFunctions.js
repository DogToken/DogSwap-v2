import { Contract, ethers, BigNumber } from "ethers";
import { fetchReserves, fetchReservesRaw, getDecimals } from "../utils/ethereumFunctions";

window.BigNumber = BigNumber;

const ERC20 = require("./../assets/abi/IERC20.json");
const PAIR = require("./../assets/abi/IUniswapV2Pair.json");

const ONE = ethers.BigNumber.from(1);
const TWO = ethers.BigNumber.from(2);
const MINIMUM_LIQUIDITY = ethers.utils.parseUnits('1000', 18);

function sqrt(value) {
    let x = ethers.BigNumber.from(value);
    let z = x.add(ONE).div(TWO);
    let y = x;
    while (z.sub(y).isNegative()) {
        y = z;
        z = x.div(z).add(z).div(TWO);
    }
    return y;
}

function min(a, b) {
    return a.lt(b) ? a : b;
}

// Add Liquidity Function
export async function addLiquidity(
    address1,
    address2,
    amount1,
    amount2,
    amount1Min,
    amount2Min,
    routerContract,
    account,
    signer
) {
    const token1 = new Contract(address1, ERC20, signer);
    const token2 = new Contract(address2, ERC20, signer);

    const token1Decimals = await getDecimals(token1);
    const token2Decimals = await getDecimals(token2);

    const amountIn1 = ethers.utils.parseUnits(amount1, token1Decimals);
    const amountIn2 = ethers.utils.parseUnits(amount2, token2Decimals);

    const amount1MinParsed = ethers.utils.parseUnits(amount1Min, token1Decimals);
    const amount2MinParsed = ethers.utils.parseUnits(amount2Min, token2Decimals);

    const deadline = ethers.BigNumber.from(Math.floor(Date.now() / 1000) + 200000);

    // Approve token1 and token2 for the router contract
    await Promise.all([
        token1.approve(routerContract.address, amountIn1).then(tx => tx.wait()),
        token2.approve(routerContract.address, amountIn2).then(tx => tx.wait())
    ]);

    const wethAddress = await routerContract.WETH();

    if (address1 === wethAddress || address2 === wethAddress) {
        // ETH + Token
        const tokenAddress = address1 === wethAddress ? address2 : address1;
        const tokenAmount = address1 === wethAddress ? amountIn2 : amountIn1;
        const ethAmount = address1 === wethAddress ? amountIn1 : amountIn2;
        const tokenAmountMin = address1 === wethAddress ? amount2MinParsed : amount1MinParsed;
        const ethAmountMin = address1 === wethAddress ? amount1MinParsed : amount2MinParsed;

        await routerContract.addLiquidityETH(
            tokenAddress,
            tokenAmount,
            tokenAmountMin,
            ethAmountMin,
            account,
            deadline,
            { value: ethAmount }
        );
    } else {
        // Token + Token
        await routerContract.addLiquidity(
            address1,
            address2,
            amountIn1,
            amountIn2,
            amount1MinParsed,
            amount2MinParsed,
            account,
            deadline
        );
    }
}

// Remove Liquidity Function
export async function removeLiquidity(
    address1,
    address2,
    liquidityTokens,
    amount1Min,
    amount2Min,
    routerContract,
    account,
    signer,
    factory
) {
    const token1 = new Contract(address1, ERC20, signer);
    const token2 = new Contract(address2, ERC20, signer);

    const token1Decimals = await getDecimals(token1);
    const token2Decimals = await getDecimals(token2);

    const liquidity = ethers.utils.parseUnits(liquidityTokens, 18);

    const amount1MinParsed = ethers.utils.parseUnits(amount1Min, token1Decimals);
    const amount2MinParsed = ethers.utils.parseUnits(amount2Min, token2Decimals);

    const deadline = ethers.BigNumber.from(Math.floor(Date.now() / 1000) + 200000);

    const wethAddress = await routerContract.WETH();
    const pairAddress = await factory.getPair(address1, address2);
    const pair = new Contract(pairAddress, PAIR, signer);

    await pair.approve(routerContract.address, liquidity).then(tx => tx.wait());

    if (address1 === wethAddress || address2 === wethAddress) {
        // ETH + Token
        const tokenAddress = address1 === wethAddress ? address2 : address1;
        const tokenAmountMin = address1 === wethAddress ? amount2MinParsed : amount1MinParsed;
        const ethAmountMin = address1 === wethAddress ? amount1MinParsed : amount2MinParsed;

        await routerContract.removeLiquidityETH(
            tokenAddress,
            liquidity,
            tokenAmountMin,
            ethAmountMin,
            account,
            deadline
        );
    } else {
        // Token + Token
        await routerContract.removeLiquidity(
            address1,
            address2,
            liquidity,
            amount1MinParsed,
            amount2MinParsed,
            account,
            deadline
        );
    }
}

// Quote function for liquidity addition
const quote = (amount1, reserve1, reserve2) => {
    return amount1.mul(reserve2).div(reserve1);
};

async function estimateFee(pair, factory, reserve0, reserve1) {
    const feeOn = (await factory.feeTo()) !== '0x3D041510f58665a17D722EE2BC73Ae409BB8715b';
    const kLast = await pair.kLast();
    const totalSupply = await pair.totalSupply();

    if (feeOn && !kLast.isZero()) {
        const rootK = sqrt(reserve0.mul(reserve1));
        const rootKLast = sqrt(kLast);

        if (rootK.gt(rootKLast)) {
            const numerator = totalSupply.mul(rootK.sub(rootKLast));
            const denominator = rootK.mul(5).add(rootKLast);
            const liquidity = numerator.div(denominator);

            if (liquidity.gt(0)) {
                return liquidity;
            }
        }
    }

    return ethers.BigNumber.from(0);
}

async function quoteMintLiquidity(
    address1,
    address2,
    amountA,
    amountB,
    factory,
    signer
) {
    const [reserveA, reserveB, totalSupply, pair] = await factory.getPair(address1, address2).then(async (pairAddress) => {
        if (pairAddress !== '0x0000000000000000000000000000000000000000') {
            const pairContract = new Contract(pairAddress, PAIR, signer);
            const reservesRaw = await fetchReservesRaw(address1, address2, pairContract, signer);
            const reserveA = ethers.BigNumber.from(reservesRaw[0].toString());
            const reserveB = ethers.BigNumber.from(reservesRaw[1].toString());
            const totalSupply = ethers.BigNumber.from(await pairContract.totalSupply());
            return [reserveA, reserveB, totalSupply, pairContract];
        } else {
            return [ethers.BigNumber.from(0), ethers.BigNumber.from(0), ethers.BigNumber.from(0), null];
        }
    });

    if (totalSupply.isZero()) {
        const val = sqrt(amountA.mul(amountB).sub(MINIMUM_LIQUIDITY));
        return val;
    }

    const fee = await estimateFee(pair, factory, reserveA, reserveB);
    const totalSupplyWithFee = totalSupply.add(fee);
    const liquidity = min(amountA.mul(totalSupplyWithFee).div(reserveA), amountB.mul(totalSupplyWithFee).div(reserveB));

    return liquidity;
}

export async function quoteAddLiquidity(
  address1,
  address2,
  amountADesired,
  amountBDesired,
  factory,
  signer
) {
  const pairAddress = await factory.getPair(address1, address2);
  const pair = new Contract(pairAddress, PAIR, signer);

  const reservesRaw = await fetchReservesRaw(address1, address2, pair, signer);
  const reserveA = ethers.BigNumber.from(reservesRaw[0].toString());
  const reserveB = ethers.BigNumber.from(reservesRaw[1].toString());

  const token1 = new Contract(address1, ERC20, signer);
  const token2 = new Contract(address2, ERC20, signer);

  const token1Decimals = await getDecimals(token1);
  const token2Decimals = await getDecimals(token2);

  // Convert string inputs to BigNumber with proper decimals
  const amountADesiredBN = ethers.utils.parseUnits(amountADesired, token1Decimals);
  const amountBDesiredBN = ethers.utils.parseUnits(amountBDesired, token2Decimals);

  if (reserveA.isZero() && reserveB.isZero()) {
      const amountOut = await quoteMintLiquidity(
          address1,
          address2,
          amountADesiredBN,
          amountBDesiredBN,
          factory,
          signer
      );
      return [amountADesiredBN, amountBDesiredBN, amountOut];
  } else {
      const amountBOptimal = quote(amountADesiredBN, reserveA, reserveB);
      if (amountBOptimal.lte(amountBDesiredBN)) {
          const amountOut = await quoteMintLiquidity(
              address1,
              address2,
              amountADesiredBN,
              amountBOptimal,
              factory,
              signer
          );
          return [amountADesiredBN, amountBOptimal, amountOut];
      } else {
          const amountAOptimal = quote(amountBDesiredBN, reserveB, reserveA);
          const amountOut = await quoteMintLiquidity(
              address1,
              address2,
              amountAOptimal,
              amountBDesiredBN,
              factory,
              signer
          );
          return [amountAOptimal, amountBDesiredBN, amountOut];
      }
  }
}

// Quote function for liquidity removal
export async function quoteRemoveLiquidity(
    address1,
    address2,
    liquidity,
    factory,
    signer
) {
    const pairAddress = await factory.getPair(address1, address2);
    const pair = new Contract(pairAddress, PAIR, signer);

    const reservesRaw = await fetchReservesRaw(address1, address2, pair, signer);
    const reserveA = ethers.BigNumber.from(reservesRaw[0].toString());
    const reserveB = ethers.BigNumber.from(reservesRaw[1].toString());

    const kLast = await pair.kLast();
    let totalSupply = ethers.BigNumber.from(await pair.totalSupply());

    const fee = await estimateFee(pair, factory, reserveA, reserveB);
    totalSupply = totalSupply.add(fee);

    const liquidityBN = ethers.utils.parseUnits(liquidity, 18);
    const Aout = reserveA.mul(liquidityBN).div(totalSupply);
    const Bout = reserveB.mul(liquidityBN).div(totalSupply);

    const token1 = new Contract(address1, ERC20, signer);
    const token2 = new Contract(address2, ERC20, signer);

    return [
        liquidity,
        ethers.utils.formatUnits(Aout, await getDecimals(token1)),
        ethers.utils.formatUnits(Bout, await getDecimals(token2))
    ];
}