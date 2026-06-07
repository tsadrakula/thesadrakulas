export const SCHEDULE = [
  ["4:30 pm", "Guests Arrive", "Country Club Christian Church"],
  ["5:00 pm", "Ceremony Begins", "Sanctuary · Black tie optional"],
  ["6:00 pm", "Cocktail Hour", "Terrace · Indian Hills"],
  ["7:00 pm", "Reception & Dinner", "Main Ballroom"],
  ["8:30 pm", "First Dances", "Ballroom"],
  ["9:00 pm", "Dancing", "Until midnight"],
  ["12:00 am", "Sparkler Send-off", "Front portico"],
] as const;

export const HOTELS = [
  { name: "The Raphael", tag: "On the Plaza", address: "325 Ward Parkway", url: "https://raphaelkc.com/" },
  { name: "Hotel Kansas City", tag: "Downtown · Historic", address: "1228 Baltimore Ave", url: "https://www.hotelkc.com/" },
  { name: "InterContinental", tag: "Plaza · Rooftop views", address: "401 Ward Parkway", url: "https://www.ihg.com/intercontinental/hotels/us/en/kansas-city/mkcha/hoteldetail" },
] as const;

export const DRESS_CODE = {
  copy:
    "Black tie optional. Gentlemen are invited to wear a tuxedo or a dark suit; ladies, a floor-length gown or an elegant cocktail dress. The palette of the evening is black and white — guests are warmly invited to echo it, though never required.",
  gentlemen: "Tuxedo or dark suit · Tie optional",
  ladies: "Floor-length gown or cocktail dress",
};
