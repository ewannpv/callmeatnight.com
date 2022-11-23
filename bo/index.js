const express = require('express');
const { readFileSync, existsSync, writeFileSync, unlink } = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const request = require('request');
const { json } = require('body-parser');
const { resourceLimits } = require('worker_threads');

const spfy_client_id = process.env.SPFY_CLIENT_ID;
const spfy_client_secret = process.env.SPFY_CLIENT_SECRET;

const app = express();

app.use(cors());

class Songs {
    constructor(path) {
        this.songs = [];
        this.path = path;
    }

    load() {
        if (!existsSync(this.path)) return false;

        this.songs = JSON.parse(readFileSync(this.path).toString());
        return true;
    }

    getAll() {
        return this.songs;
    }

    addSong(song) {
        this.songs.push(song);

        writeFileSync(this.path, JSON.stringify(this.songs));
    }

    removeSong(id) {
        const elt = this.songs.splice(id, 1);

        if (elt.length === 0) return false;

        if (elt[0].cover_img_name) {
            unlink(`../assets/img/songs/${image_name}`);
        }

        writeFileSync(this.path, JSON.stringify(this.songs));
        return true;
    }
}

const validateSong = (data) => {
    // TODO: Checks

    const matches = data.img_data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (matches.length !== 3) {
        return false;
    }

    data.img_data = Buffer.from(matches[2], 'base64');

    return true;
};

const songs = new Songs('songs.json');
songs.load();

app.get('/', (_, res) => {
    res.json(songs.getAll());
});

app.post('/', bodyParser.json({ limit: '25mb' }), (req, res) => {
    const song = req.body;

    if (!validateSong(song)) {
        return res.status(400).end();
    }

    const file = song.img_data;
    const image_name = `img_${new Date().getTime()}.jpg`;

    writeFileSync(`../assets/img/songs/${image_name}`, file);

    delete song.img_data;
    song.cover_img_name = image_name;

    songs.addSong(song);

    res.end();
});

app.post('/spfy', bodyParser.json(), (req, res) => {
    if (!req.body.track_id) {
        return res.status(400).end();
    }

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            Authorization: 'Basic ' + Buffer.from(spfy_client_id + ':' + spfy_client_secret).toString('base64'),
        },
        form: {
            grant_type: 'client_credentials',
        },
        json: true,
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const token = body.access_token;

            request.get(
                {
                    url: `https://api.spotify.com/v1/tracks/${req.body.track_id}`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    json: true,
                },
                (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        const song = {
                            title: body.name,
                            artist: body.artists[0].name,
                            availability_date: '',
                            spotify_link: body.external_urls.spotify,
                            spfy_image: body.album.images[0].url,
                        };

                        songs.addSong(song);

                        return res.end();
                    }

                    res.status(404).end();
                }
            );
        } else {
            return res.status(500).end('Spotify fail');
        }
    });
});

app.delete('/:id', (req, res) => {
    if (songs.removeSong(req.params.id)) return res.end();

    return res.status(404).end();
});

app.listen(8080);
