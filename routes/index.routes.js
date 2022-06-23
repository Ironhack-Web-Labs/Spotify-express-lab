const router = require("express").Router();
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

/* GET home page */
router.get("/", (req, res, next) => {

  res.render("index");
});

router.get("/artist-search", (req, res) => {
  const { artist } = req.query;

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      console.log(data.body.artists.items)
      res.render("artist-search-results", { artists: data.body.artists.items })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

router.get("/albums/:id", (req, res) => {
  const { id } = req.params;
  spotifyApi
    .getArtistAlbums(id)
    .then(data => {
      console.log(data.body.items)
      res.render("albums", { albums: data.body.items })
    })
    .catch(err => console.log("Problem loading the artist info ", err))
});

router.get("/album-tracks/:id", (req, res) => {
  const { id } = req.params;

  spotifyApi
    .getAlbumTracks(id)
    .then(data => {
      res.render("album-tracks", { songs: data.body.items });
    })
    .catch(err => console.log("Problem loading the tracks", err))
});

module.exports = router;
