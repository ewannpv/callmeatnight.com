const getData = () => {
    fetch(`${ENDPOINT}`)
        .then((res) => res.json())
        .then((songs) => {
            const songListEltTemplate = document.querySelector('template#song-list-elt');
            const list = document.querySelector('ul.song-list');

            list.innerHTML = '';

            for (let i = 0; i < songs.length; i++) {
                const clone = songListEltTemplate.content.cloneNode(true);

                clone.querySelector('.data span').innerHTML = `${songs[i].title} - ${songs[i].artist}`;

                if (songs[i].cover_img_name)
                    clone.querySelector('.data img').src = `/assets/img/songs/${songs[i].cover_img_name}`;
                else if (songs[i].spfy_image) clone.querySelector('.data img').src = `${songs[i].spfy_image}`;

                clone.querySelector('.actions').addEventListener('click', () => {
                    if (window.confirm('Are you sure?')) {
                        fetch(`${ENDPOINT}/${i}`, {
                            method: 'DELETE',
                            headers: {
                                'X-Chlo-Auth': 'c2FsdXQgY29wYWluIGNhIHZhIG91IHF1b2k/IE91YWlzIHRyYW5xdWlsbGU=',
                            },
                        }).then((res) => {
                            if (res.status !== 200) {
                                return alert('Error');
                            }

                            alert('Removed!');
                            getData();
                        });
                    }
                });

                list.appendChild(clone);
            }
        });
};

const main = () => {
    getData();
    document.querySelector('form#spfy').addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();

        document.querySelector('#submit-spfy').setAttribute('disabled', 'true');

        const formData = new FormData(e.currentTarget);

        if (!formData.has('track_id')) {
            document.querySelector('#submit-spfy').removeAttribute('disabled');
            return;
        }

        fetch(`${ENDPOINT}/spfy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Chlo-Auth': 'c2FsdXQgY29wYWluIGNhIHZhIG91IHF1b2k/IE91YWlzIHRyYW5xdWlsbGU=',
            },
            body: JSON.stringify({ track_id: formData.get('track_id') }),
        }).then((res) => {
            document.querySelector('#submit-spfy').removeAttribute('disabled');

            if (res.status !== 200) {
                return alert('Save failed!');
            }

            alert('Saved!');
            getData();
        });
    });

    document.querySelector('form#future').addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();

        document.querySelector('#submit').setAttribute('disabled', 'true');

        // TODO: Validation

        const formData = new FormData(e.currentTarget);

        const body = {};
        for (const e of formData) {
            if (e[0] !== 'album_art') {
                body[e[0]] = e[1];
            }
        }

        // Add image
        const reader = new FileReader();
        reader.addEventListener('loadend', (e) => {
            body.img_data = e.target.result;

            fetch(`${ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Chlo-Auth': 'c2FsdXQgY29wYWluIGNhIHZhIG91IHF1b2k/IE91YWlzIHRyYW5xdWlsbGU=',
                },
                body: JSON.stringify(body),
            }).then((res) => {
                document.querySelector('#submit').removeAttribute('disabled');

                if (res.status !== 200) {
                    return alert('Save failed!');
                }

                alert('Saved!');
                getData();
            });
        });

        reader.addEventListener('error', () => {
            document.querySelector('#submit').removeAttribute('disabled');
            alert('File load failed!');
        });

        reader.readAsDataURL(formData.get('album_art'));
    });
};

document.addEventListener('DOMContentLoaded', main);
