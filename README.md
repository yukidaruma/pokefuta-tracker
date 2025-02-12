# Pokéfuta Tracker

[pokefuta.yuki.games](https://pokefuta.yuki.games)

This app helps visiting Pokéfutas in Japan.

Built with [Next.js](https://github.com/vercel/next.js), hosted for free on [Vercel](https://vercel.com/).

## Getting started

Run these commands to set up the development environment:

```shell
git clone https://github.com/yukidaruma/pokefuta-tracker && cd pokefuta-tracker # First time only

npm i
npm run dev
```

Since this repository doesn't include Pokéfuta images, you'll need to modify the `PokefutaImage` component for local development.

```diff
--- a/components/pokefuta-image.tsx
+++ b/components/pokefuta-image.tsx
@@ -12,10 +12,9 @@ const PokefutaImage: React.FC<PokefutaImageProps> = ({ id, size }) => {
   const names = pokefuta.pokemons.map(getPokemonName).join(", ");

   return (
-    <Image
-      priority={false}
+    <img
       alt={`Image of pokefuta with ${names}`}
-      src={`/images/pokefuta/${pokefuta.id}.png`}
+      src={`https://pokefuta.yuki.games/images/pokefuta/${pokefuta.id}.png`}
       width={size}
       height={size}
     />
```

## Acknowledgement

This repository contains customized copy of [`@react-map/japan`](https://www.npmjs.com/package/@react-map/japan) in [japan](japan) directory (See [`japan/LICENSE`](japan/LICENSE)).
