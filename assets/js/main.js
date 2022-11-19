const songs = [
  {
    title: "Piscine de fleurs",
    artist: "Call Me At Night",
    cover_img_name: "song_01.jpg",
    availability_date: "NOVEMBER 25, 2022",
    spotify_link: "",
  },
];

console.log(songs);

const populateCarousel = () => {
  for (let index = 0; index < songs.length; index++) {
    let songHeader = `<div class="carousel-item h-100 ${
      index == 0 ? `active` : ``
    }">
    <div class="row h-100 align-items-center">
      <div class="col text-center">`;

    let songCover = `<img
    src="${`./assets/img/songs/${songs[index].cover_img_name}`}"
    class="carousel_song_cover center"
    alt=""
  />`;
    let songLink = songs[index].spotify_link
      ? `<div class="carousel_song_link">
  <a href="${songs[index].spotify_link}" target="_blank">
    <i
      class="fa-brands fa-spotify carousel_spotify_logo_available" ></i>
  </a></div>`
      : `<div class="carousel_song_link"><i
  class="fa-brands fa-spotify carousel_spotify_logo_not_available" ></i></div>`;

    let songInfo = ` <div class="carousel_song_title">${songs[index].title}</div>
  <div class="carousel_song_artist">${songs[index].artist}</div>`;

    let songAvailability = songs[index].availability_date
      ? `<div class="carousel_song_available">
            <i class="fa-regular fa-calendar"></i>
            AVAILABLE ${songs[index].availability_date}
          </div>`
      : ``;

    let songFooter = `</div>`;

    let songInnerHTML =
      songHeader +
      songCover +
      songLink +
      songInfo +
      songAvailability +
      songFooter;

    document.getElementById("carousel_items").innerHTML += songInnerHTML;
  }

  console.log(document.getElementById("carousel_items").value);
};

populateCarousel();
