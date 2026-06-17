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

export const ADULTS_ONLY = {
  copy: "We adore your little ones — truly. To let every guest relax, raise a glass, and dance the night away, we've reserved this evening for adults only. We hope you'll embrace it as a rare night out, and join us in making this moment ours to celebrate.",
};
