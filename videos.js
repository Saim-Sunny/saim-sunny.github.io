// Saim: edit this file to change the videos on your site.
//
// Each video is one line. Use either:
//   id:   the YouTube code (the part after watch?v=), or
//   link: the full link to a YouTube, Instagram or Facebook video.
// client and length are optional. thumb is optional: upload an image to the
// "images" folder and write e.g. thumb: "/images/my-cover.jpg".
// Delete a line to hide a video. A group with no videos is hidden.

window.SITE = {
  instagram: "", // your profile link, e.g. "https://www.instagram.com/yourname/"

  // The 3 videos on the home page (YouTube codes or links)
  home: ["vGT17Y8J1fg", "AOc-qHYJToY", "_btci4SYMl0"],

  groups: [
    {
      name: "Client work",
      videos: [
        // { title: "Product reel", client: "Lasqala", link: "https://www.instagram.com/reel/ABC123/" },
      ],
    },
    {
      name: "Films and vlogs",
      videos: [
        { title: "I made a film about our trip", length: "29:54", id: "vGT17Y8J1fg" },
        { title: "My sleeping schedule", length: "4:35", id: "sTonugWrb3Q" },
        { title: "Balanced week", length: "6:03", id: "AOc-qHYJToY" },
        { title: "We went to Paris", length: "18:57", id: "_btci4SYMl0" },
        { title: "36H of Work", length: "2:08", id: "Z1gawIKD06k" },
        { title: "Life in Meeting", length: "1:31", id: "g5FjjgJsZt4" },
      ],
    },
    {
      name: "Events",
      videos: [
        { title: "Savar Cantonment School Reunion", length: "2:25", id: "DpNEQ2we0fQ" },
        { title: "USA Ambassador's Visit to Daffodil International University", length: "1:23", id: "Kq3CO5xYteg" },
      ],
    },
    {
      name: "Other projects",
      videos: [
      ],
    },
  ],
};
