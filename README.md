## Getting Started

`npm install` to install dependencies

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Everything you need is inside `app/page.jsx`.

To customize the website to load info from your own contract, change the following:

- Update `contractAddress` in `app/page.jss` to your own BuyMeACoffee contract on the Sepolia testnet.
- Update `utils/BuyMeACoffee.json` to match the json artifact for your contract after compilation.
- Update the name and footer text in `app/page.jsx` to your own name and info.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
