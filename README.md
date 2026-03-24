# ai-food

This repository contains the Next.js app in [food-gene](/Users/togtokhbayarbatsukh/Desktop/ai-food/food-gene).

## Local Development

```bash
cd food-gene
npm install
npm run dev
```

## Vercel Deployment

This repo is organized like a small monorepo, so the Vercel project must use:

- Root Directory: `food-gene`
- Framework Preset: `Next.js`

Required production environment variables live in the `food-gene` app, for example:

- `HUGGINGFACE_API_KEY`
- `HUGGINGFACE_MODEL` or `HUGGINGFACE_API_URL`
- `GROQ_API_KEY`
