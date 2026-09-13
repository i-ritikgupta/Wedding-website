/*
  ====================================================================
  EDIT ME: All personalizable wedding details live in this one file.
  Change the values below and refresh the page — no other file needs
  to change for basic customization.
  ====================================================================
*/

const WEDDING_CONFIG = {

  // Used for the countdown timer. Format: "YYYY-MM-DDTHH:mm:ss"
  weddingDateTime: "2027-01-24T10:00:00",

  // Event schedule for "The Celebration" section.
  events: [
    {
      day: "22",
      month: "Jan",
      title: "Mehndi & Sangeet",
      time: "6:00 PM onwards",
      venue: "Rosewood Banquet Hall, Ghazipur",
      mapQuery: "Rosewood Banquet Hall Ghazipur"
    },
    {
      day: "23",
      month: "Jan",
      title: "Reception",
      time: "6:30 PM onwards",
      venue: "Grand Palace Gardens, Ghazipur",
      mapQuery: "Grand Palace Gardens Ghazipur"
    },
    {
      day: "24",
      month: "Jan",
      title: "Wedding Muhurtham",
      time: "10:00 AM onwards",
      venue: "Sri Kalyana Mahal, Ghazipur",
      mapQuery: "Sri Kalyana Mahal Ghazipur"
    }
  ],

  // Flat list of photos for the masonry album.
  albumImageSeeds: [
    "album-1", "album-2", "album-3", "album-4",
    "album-5", "album-6", "album-7", "album-8"
  ]
};
