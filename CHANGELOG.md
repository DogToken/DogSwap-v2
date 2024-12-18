# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.10] - 2024-12-18

### Changes
- Added a few tokens in past updates
- Added RANGER/WhaleBux/BaTs reward Pools
- Introduced Weight and Boost tooltips on pools (to be worked on)

## [2.2.9] - 2024-12-07

### Fixes

- Liquidity Issue (Thanks Musdasch)
- Changed multirequest to coingecko for pricing -> Now 1 time/30 sec (Thanks Musdasch)
- Massive code cleanup (Thanks Musdasch)

### Additions

- Added WhaleBux listing, logo & dogpool

## [2.2.8] - 2024-11-26

### Fixes

- Broken token images after mintme.com update

### Changes

- Made token earnings free, for reduced deposit fees, a service can be bought now instead
- Added $RANGER

## [2.2.7] - 2024-10-17

### Changes

- Split Staking page in components for optimal coding (view is still same for now as i'm bugfixing)
- XatteR logo rebranding

### Bugfixes

- Collection button has been optimised

### Additions

- You can now add tokens to your wallet by pressing the + sign next to the tokens on the swap popup modal
(Tokens that are over 12 characters will give you an error message)

## [2.2.6] - 2024-10-17

### Changes

- Added XatteR to tokens in dashboard as a known token
- Split the pools page into components for proper coding overview
- Added a collect all rewards button on the pools pages, UI will adapt as we go

### Bugfixes

- Mintme deployed tokens on dashboard were given 18 decimals, corrected to 12

### Additions

- Collect button on Pools pages (will collect all pending rewards, takes a while though)

## [2.2.5] - 2024-10-07

### Changes

- Swap page redesign

## [2.2.4] - 2024-10-05

### Bugfixes

- Couldn't withdraw LP tokens (nobody missed this???) - Added a max button

## [2.2.3] - 2024-10-02

### Minor Update - Tokens added to list

- Donatello
- DGOne

## [2.2.2] - 2024-10-01 

### Changes

- Token select dialog upgrade (Search, Select, Scroll and Add!)
- Homepage is visible, even when disconnected &/ without a wallet
- About section added on homepage

### BonePools Activated

- DGOne

### Bugfixes

- Could not find the add button on token ui dialog
- Xatte'R' branding

## [2.2.1] - 2024-09-30 

### Changes

- On the Dash, token names now link to their respective mintme url

### BonePools Activated

- bobdubbloon (also listed)
- Dance And Music

### Bugfixes

- If the mintme chain is not in your wallet, a request will be made when connecting first.

## [2.2.0] - 2024-09-29 

### Public Release

- The main website "https://dogswap.xyz" will be moved to "https://old.dogswap.xyz"
- The beta will be moved from "https://beta.dogswap.xyz" to "https://dogswap.xyz" acting as the new frontpage.

### New Features

- Admin Dashboard (Permissioned)
- Bone Pools (Seperate Page)
- Weekly Pools (Added to pools)
- Active / Inactive Pools

### Changes

- Profile Dashboard split into components
- Coinlist altered to original
- Featured Pool has altered UI & Project link added
- Frontpage editing to match DogSwap functions
- Bone Pools have 10% fee if unused and no rewards
- Deposit / Withdraw / Claim buttons updated
- Pool (in)activity and visible listing
- Pools UI improved with hider, section select

### Bugfixes

- Tooltip on Profile Dashboard is fixed due to component loading
- Navbar subnav ul UI change (CSS)
- Redundant code removal
- Images on the highlight adjusted (still needs new images)

## [2.1.5] - 2024-09-21

### New Features

- Homepage
- Ticker

### Changes

- Navbar change (Added Home & Ticker)
- Homepage changes
- Main page is now Homepage
- More visibility for the featured pool
- URL creation & localisation old.dogswap
- Featured Page enhancement
- Navbar functionality (add subnav)

### New Files

- Home / Components
- FeaturedPool page

### Bugfixes

- Ticker bug

## [2.1.4] - 2024-09-14

### New Features

- Livechat by Smartsupp integrated so users can connect and get help
- Profile Dashboard has been altered with more functionality

### Changes

- Navbar has undergone changes, the profile options have changed (transactions went into the dashboard)
- Also the logo has been altered to represent an image instead of an Emoji
- Footer has changed drastically, social images made clickable and links added, 
dead links updated to work, changed twitter to X and multiple UI edits
- New pages have been added to start progress on officialisation and regularisation
- Links have been checked to work properly and not show any dead links.

### New Files

- Featured Pool view has been added, a purchasable and dedicated page that is sold on mintme.
- Featured Pool needed a new page where the info could be pulled from
- Cookies page
- Privacy page
- Terms page
- Profile Dashboard has been remade

### Updated

- Changelog
- Package Version

## [2.1.3] - 2024-09-01

### Changes

- Added TVL to staking page
- UI / Personalisation (icon / SEO)
- Changed Links in footer (Blog, Docs)

### New Files

- Added images folder for UI
- Added [Docs](https://docs.dogswap.xyz)

## [2.1.2] - 2024-08-30

### New Features

- Optimised staking page
- GA-4 Analytics tracking on all pages

### Changes

- Adjusted code in NavBar to fetch price
- Moved TVL to staking page
- Added APY to staking page (Not working atm)
- Changed links in Footer
- Dashboard edits to link Profile
- Updated ReadMe

### New Files

- Added BoneToken abi
- Added Staking page

### Fixes

- Dead links
- eslint Unused / errors

## [2.1.1] - 2024-08-27

Small incremental update

### New features

- Dashboard page

### New files

- README.md
- CHANGELOG.md
- ROADMAP.md

### Changes

- Readme extention

## [2.1.0] - 2024-08-27

We're super excited to announce `DogSwap` 2.0!

This version is a beta product for the next version of DogSwap.
I am starting here with a counter, as this is also a public available demo.

Lots of links in the footer and dash can contain dummy data for now that needs to be altered.

### Major changes

- React v16 -> React 18
- Material UI -> MUI
- UI Theming / Component rewrites
- Connect button for injected wallets

### New features

- Changelog
- Contributing
- Code of Conduct
- Claim Button

### Changes

- Full UI overhaul
 - New navbar with
  - Profile view
  - Transactions
  - Pricecalc is now util (better loading)
 - New footer
- Token selector theming
- Organised pool view