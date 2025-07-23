"use client";

import React from "react";

import { useWishlistStorage } from "@/utils/hooks";

type WishlistContextProps = {
  wishlist: Record<string, boolean>;
  updateWishlist: (id: number, value: boolean) => void;
  resetWishlist: () => void;
};

const WishlistContext = React.createContext<WishlistContextProps>(
  {} as WishlistContextProps
);

const WishlistProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [wishlist, updateWishlist, resetWishlist] = useWishlistStorage();

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        updateWishlist,
        resetWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

const useWishlistContext = () => React.useContext(WishlistContext);

export { WishlistContext, WishlistProvider, useWishlistContext };
