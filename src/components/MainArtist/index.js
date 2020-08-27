import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from "react-router-dom";

const MainArtist = () => {
    const { id } = useParams();
    const [artist, setArtist] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://artists-api.vercel.app/artists');
                const data = response.data
                const artistFiltered = data.find(artist => artist._id === id)
                setArtist(artistFiltered)
        
            } catch (error) {
                console.error('este es mi error',error);
            }
        }
        fetchData()
    }, [])

    // ----------------------------------------------------------

    const [tracks, setTracks] = useState([])

    useEffect(() => {
        const data = () =>{

            var request = require('request'); // "Request" library
            var client_id = '42096df29d77496488a4e35107d58df4'; // Your client id
            var client_secret = '732e624de6fd4fdfb5875e67e7659515'; // Your secret
            // your application requests authorization
            var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                headers: {
                    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                },
                form: {
                    grant_type: 'client_credentials'
                },
                json: true
            };
            
            request.post(authOptions, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    // use the access token to access the Spotify Web API
                    var token = body.access_token;
                    var options = {
                        url: `https://api.spotify.com/v1/search?q=${artist.name}&type=artist&offset=0&limit=1`,
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                        json: true
                    };
                    console.log(options.url);
                    request.get(options, function (error, response, body) {
                        //console.log(body.items[0].track.artists[0]);
                        //console.log(response.body.items)
                        const artistID = response.body.artists.items[0].id;
                        var secondFetch = {
                            url: `https://api.spotify.com/v1/artists/${artistID}/top-tracks?country=AR`,
                            headers: {
                                'Authorization': 'Bearer ' + token
                            },
                            json: true
                        };
                        request.get(secondFetch, function (error, response, body) {
                            const anotherJson = response.body.tracks;
                            const tracksNames = anotherJson.map(tracks => tracks.name);
                            setTracks(tracksNames);
                        });
                        //console.log(json);
                        });
                }
            });
            
        }
        data();
}, [])
  

    return (
        <div className="main">
            <h1>Listado de artistas</h1>
            <h2>{artist.name}</h2>
            <img src={artist.avatar} alt={artist.name} />
            <p>{artist.genre}</p>
            <Link to="/">Volver</Link>
        </div>
    )
}

export default MainArtist

//primer token: BQCWFkqPEZDTpCKav-jKH9YQM35G1LWblm0sFImrekHFW3HPxEU5R5Q0POf8PJecLR1j060w46MuTVHsAaA
