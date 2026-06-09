export const SCHEDULE = [
  ["4:45 pm", "Guests Arrive", "Country Club Christian Church"],
  ["5:00 pm", "Ceremony Begins", "Sanctuary · Black tie optional"],
  ["6:00 pm", "Cocktail Hour", "Terrace · Indian Hills"],
  ["7:00 pm", "Reception & Dinner", "Main Ballroom"],
  ["8:00 pm", "First Dances", "Ballroom"],
  ["8:30 pm", "Dancing", "Ballroom"],
  ["11:00 pm", "Sendoff", "Front building"],
] as const;

export const HOTELS = [
  {
    name: "Sheraton Overland Park",
    tag: "At the Convention Center",
    address: "6100 College Blvd, Overland Park",
    url: "https://www.marriott.com/en-us/hotels/mcicc-sheraton-overland-park-hotel-at-the-convention-center/overview/",
  },
] as const;

export const DRESS_CODE = {
  copy: "Black tie optional. Gentlemen are invited to wear a tuxedo or a dark suit; ladies, a floor-length gown or an elegant cocktail dress. The palette of the evening is black and white — guests are warmly invited to echo it, though never required.",
  gentlemen: "Tuxedo or dark suit · Tie optional",
  ladies: "Floor-length gown or cocktail dress",
};
