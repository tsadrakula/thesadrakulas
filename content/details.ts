export const SCHEDULE = [
  ["3:30 pm", "Guests Arrive", "Country Club Christian Church"],
  ["4:00 pm", "Ceremony Begins", "Sanctuary · Black tie"],
  ["5:00 pm", "Cocktail Hour", "Terrace · Indian Hills"],
  ["6:30 pm", "Reception & Dinner", "Main Ballroom"],
  ["8:30 pm", "First Dances", "Ballroom"],
  ["9:00 pm", "Dancing", "Until midnight"],
  ["12:00 am", "Sparkler Send-off", "Front portico"],
] as const;

export const HOTELS = [
  { name: "The Raphael", tag: "On the Plaza", address: "325 Ward Parkway" },
  { name: "Hotel Kansas City", tag: "Downtown · Historic", address: "1228 Baltimore Ave" },
  { name: "InterContinental", tag: "Plaza · Rooftop views", address: "401 Ward Parkway" },
] as const;

export const DRESS_CODE = {
  copy:
    "We ask that gentlemen wear a black tuxedo with a bow tie, and ladies a floor-length gown. The palette of the evening is black and white — guests are warmly invited to echo it, though not required.",
  gentlemen: "Tuxedo · Black bow tie · Polished oxfords",
  ladies: "Floor-length gown · Evening heels",
};
