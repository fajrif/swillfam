export type Product = {
  img: string;
  title: string;
  description: string;
  price: string;
};

const DESCRIPTION =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.";

const PRODUCT_IMAGES = [
  "/merchandise/pink-tshirt-png-transparent-unisex-apparel-casual-style 1.png",
  "/merchandise/striking-modern-pink-lighter-vivid-red-background-with-mysterious-glowing-light-perfect-bold 1.png",
  "/merchandise/striking-modern-pink-lighter-vivid-red-background-with-mysterious-glowing-light-perfect-bold 1.png",
  "/merchandise/Group 33719.png",
  "/merchandise/retro-lava-lamp-dark-room 1.png",
  "/merchandise/yellow-tshirt-tshirt-clothing-yellow-tshirt 1.png",
  "/merchandise/pink-tshirt-png-transparent-unisex-apparel-casual-style 1.png",
  "/merchandise/striking-modern-pink-lighter-vivid-red-background-with-mysterious-glowing-light-perfect-bold 1.png",
  "/merchandise/pink-beanie-with-cuff-women-s-winter-accessories 1.png",
];

/** Static placeholder merchandise grid (Figma "SwillFam - Merchandise"). */
export const PRODUCTS: Product[] = PRODUCT_IMAGES.map((img) => ({
  img,
  title: "Lorem Ipsum",
  description: DESCRIPTION,
  price: "IDR 500.000",
}));
