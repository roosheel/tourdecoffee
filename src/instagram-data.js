// Curated Instagram feed for the Tour de Coffee site.
//
// This is a hand-edited list — no API, no tokens, no third-party widget.
// To add a post:
//   1. Save the image into  public/instagram/  (a .jpg around 1000px wide is ideal)
//   2. Add an entry below with its filename and the post's URL
//
// To get a post's URL: open the post on instagram.com, click the "..."
// menu -> "Copy link", and paste it as `permalink`.
//
// `caption` shows on hover — keep it short. Order here is the order on the page.

const instagramPosts = [
  {
    id: "crew-applestore",
    src: "instagram/crew-applestore.jpg",
    permalink: "https://www.instagram.com/tourdecoffee_runclub/",
    caption: "The 6:30am crew at the cube",
  },
];

export default instagramPosts;
