import type { ImageSourcePropType } from 'react-native';

/**
 * Demo evidence photos, cropped from media/Stray Animals in Urban Hardship.png.
 * Fictional demo content only (is_demo); real evidence comes from reporters.
 */
export const PHOTOS = {
  'dog-leg-wound': require('../assets/cases/dog-leg-wound.jpg'),
  'dog-leg-wound-closeup': require('../assets/cases/dog-leg-wound-closeup.jpg'),
  'dog-leg-wound-face': require('../assets/cases/dog-leg-wound-face.jpg'),
  'cat-neck-wound': require('../assets/cases/cat-neck-wound.jpg'),
  'cat-neck-wound-closeup': require('../assets/cases/cat-neck-wound-closeup.jpg'),
  'kitten-weak': require('../assets/cases/kitten-weak.jpg'),
  'kitten-weak-face': require('../assets/cases/kitten-weak-face.jpg'),
  'puppy-trapped': require('../assets/cases/puppy-trapped.jpg'),
  'puppy-trapped-face': require('../assets/cases/puppy-trapped-face.jpg'),
  'dog-lying': require('../assets/cases/dog-lying.jpg'),
  'dog-head-wound': require('../assets/cases/dog-head-wound.jpg'),
  'dog-net': require('../assets/cases/dog-net.jpg'),
  'kitten-drain': require('../assets/cases/kitten-drain.jpg'),
} satisfies Record<string, ImageSourcePropType>;

export type PhotoKey = keyof typeof PHOTOS;

/** Demo adoption portraits, cropped from media/Adorable Pet Adoption Portraits.png. */
export const ADOPTION_PHOTOS = {
  'dog-golden': require('../assets/adoption/dog-golden.jpg'),
  'kitten-tabby': require('../assets/adoption/kitten-tabby.jpg'),
  'puppy-black-tan': require('../assets/adoption/puppy-black-tan.jpg'),
  'cat-orange': require('../assets/adoption/cat-orange.jpg'),
  'dog-black': require('../assets/adoption/dog-black.jpg'),
  'kitten-calico': require('../assets/adoption/kitten-calico.jpg'),
} satisfies Record<string, ImageSourcePropType>;

export type AdoptionPhotoKey = keyof typeof ADOPTION_PHOTOS;

/** Food donation product images (from media/), shown for illustration only. */
export const FOOD_PHOTOS = {
  'dry-cat-food-1kg': require('../assets/food/dry-cat-food-1kg.jpg'),
  'dry-cat-food-3kg': require('../assets/food/dry-cat-food-3kg.jpg'),
  'dry-dog-food-5kg': require('../assets/food/dry-dog-food-5kg.jpg'),
  'wet-cat-food': require('../assets/food/wet-cat-food.jpg'),
} satisfies Record<string, ImageSourcePropType>;

export type FoodPhotoKey = keyof typeof FOOD_PHOTOS;

/** Cut-out images on white for the Home promo tiles (from media/). */
export const PROMO_PHOTOS = {
  kitten: require('../assets/promo/kitten-tabby-cutout.jpg'),
  petFood: require('../assets/promo/pet-food-display.jpg'),
  vets: require('../assets/promo/vets-pets-kit.jpg'),
  safety: require('../assets/promo/safety-kit.jpg'),
} satisfies Record<string, ImageSourcePropType>;

export function adoptionPhoto(a: { photo?: AdoptionPhotoKey }): ImageSourcePropType | undefined {
  return a.photo ? ADOPTION_PHOTOS[a.photo] : undefined;
}

/** The i-th evidence photo of a case, if it has one. */
export function casePhoto(c: { photos?: PhotoKey[] }, i = 0): ImageSourcePropType | undefined {
  const key = c.photos?.[i];
  return key ? PHOTOS[key] : undefined;
}
