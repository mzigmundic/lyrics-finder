// Get elements
const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

// API
const apiURL = 'https://api.lyrics.ovh';


// Search by song or artist
async function searchSongs(term) {
    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();

    console.log(data);
    if (data.total !== 0) {
        showData(data);
    } else {
        result.innerHTML = `<p>No artists or songs found.</p>`;
    }
}

// Show song and artist in DOM
function showData(data) {
    result.innerHTML = `
        <ul class="songs">
            ${data.data
                .map(song => `
            <li>
                <span><strong>${song.artist.name}</strong> - ${song.title}</span>
                <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
            </li>
            `)
            .join('')
        }
        </ul>
    `;

    if (data.prev || data.next) {
        more.innerHTML = `
            ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
            ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
        `;
    } else {
        more.innerHTML = '';
    }
}

// Get prev and next songs
async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();

    showData(data);
}

// Get lyrics for song
async function getLyrics(artist, songtitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songtitle}`);
    const data = await res.json();

    if (data.lyrics) {
        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>') ?? '';
    
        result.innerHTML = `
            <h2 class="song-title"><strong>${artist}</strong> - ${songtitle}</h2>
            <span class="centered song-text">${lyrics}</span>  
        `;
    } else {
        result.innerHTML = '<p class="centered">No lyrics found</p>';
    }

    more.innerHTML = '';
}


// Event listeners

// Search button
form.addEventListener('submit', e => {
    e.preventDefault();

    const searchTerm = search.value.trim();

    if (!searchTerm) {
        result.innerHTML = `<p>Please enter a search term.</p>`;
        more.innerHTML = '';
    } else {
        searchSongs(searchTerm);
    }
});

// Get lyrics buttons
result.addEventListener('click', e => {
    
    const clickedElement = e.target;

    if (clickedElement.tagName === 'BUTTON') {
        const artist = clickedElement.getAttribute('data-artist');
        const songtitle = clickedElement.getAttribute('data-songtitle');

        getLyrics(artist, songtitle);
    }
});