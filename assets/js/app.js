const getSongs = async () => {
    return fetch(ENDPOINT).then((res) => res.json());
};

const run = async () => {
    const songs = await getSongs();
    const songTemplate = document.querySelector('template#song-t');
    const carousel = document.querySelector('#carousel_items');

    for (let i = 0; i < songs.length; i++) {
        const clone = songTemplate.content.cloneNode(true);

        if (i === 0) clone.querySelector('.carousel-item').classList.add('active');

        if (songs[i].cover_img_name) clone.querySelector('img').src = `assets/img/songs/${songs[i].cover_img_name}`;
        else if (songs[i].spfy_image) clone.querySelector('img').src = `${songs[i].spfy_image}`;

        const linkElt = clone.querySelector('.carousel_song_link');
        if (songs[i].spotify_link) {
            const link = document.createElement('a');
            link.href = songs[i].spotify_link;
            link.target = '_blank';
            link.addEventListener('click', () => {
                gtag('event', `open_song_${songs[i].title}`, {
                    event_category: 'sound_carousel',
                    event_label: `${songs[i].title}`,
                });
            });

            link.innerHTML = '<i class="fa-brands fa-spotify carousel_spotify_logo_available"></i>';

            linkElt.appendChild(link);
        } else {
            linkElt.innerHTML = '<i class="fa-brands fa-spotify carousel_spotify_logo_not_available"></i>';
        }

        clone.querySelector('.carousel_song_title').innerHTML = songs[i].title;
        clone.querySelector('.carousel_song_artist').innerHTML = songs[i].artist;

        if (songs[i].availability_date) {
            clone.querySelector(
                '.carousel_song_available span'
            ).innerHTML = `AVAILABLE ON ${songs[i].availability_date}`;
        } else {
            clone.querySelector('.carousel_song_available').remove();
        }

        carousel.appendChild(clone);
    }

    $('#carousel').carousel({
        interval: 5000,
    });

    if (songs.length === 1) {
        document.querySelectorAll('.carousel-control').forEach((e) => e.remove());
    } else {
        document
            .querySelector('.carousel-control-prev')
            .addEventListener('click', () => $('#carousel').carousel('prev'));
        document
            .querySelector('.carousel-control-next')
            .addEventListener('click', () => $('#carousel').carousel('next'));
    }

    document.querySelector('.loader').remove();
};

document.addEventListener('DOMContentLoaded', run);
