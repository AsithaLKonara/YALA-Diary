export const siteConfig = {
  name: "Yala Diary",
  description: "Experience the ultimate safari adventure in Yala National Park. Book tailored safari packages, luxury camping, and expert guides.",
  url: process.env.NEXT_PUBLIC_APP_URL as string,
  ogImage: `${process.env.NEXT_PUBLIC_APP_URL}/images/og-image.jpg`,
  twitterHandle: "@yaladiary",
  keywords: [
    "Yala Safari",
    "Yala National Park",
    "Safari Booking",
    "Sri Lanka Safari",
    "Luxury Camping Yala",
    "Leopard Safari Sri Lanka"
  ],
  links: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL as string,
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL as string,
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL as string
  }
};
