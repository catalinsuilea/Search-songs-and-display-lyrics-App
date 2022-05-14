"use strict";
const intro = document.querySelector(".intro");
const search = document.querySelector(".btn-search");
const input = document.querySelector(".input");
const lyricsContainer = document.querySelector(".get-lyrics-container");
const form = document.querySelector(".form");
const songsContainer = document.querySelector(".lyrics-container");
const errorNext = document.querySelector(".error-next-btn");
//const next = document.querySelector(".next");
//const prev = document.querySelector(".prev");
//just one search on page
//let justOne = false;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  intro.style.display = "none";
  const searchValue = input.value.trim();
  if (searchValue) {
    lyricsContainer.style.display = "none";
    songsContainer.style.display = "block";
    searchSong(searchValue);
  }
});

//Fetching a song
const searchSong = async function (input) {
  try {
    const res = await fetch(`https://api.lyrics.ovh/suggest/${input}`);
    if (!res.ok)
      throw new Error(
        `No song found or API error.Type the song/artist/band name again! ${res.status}`
      );
    const data = await res.json();
    console.log(data);
    if (data.data.length === 0) {
      songsContainer.innerHTML = `There are no results for '${input}'. Try again!`;
      //Render the data to DOM
    } else generateMarkup(data);
  } catch (err) {
    songsContainer.innerHTML = `Something went wrong 💥. ${err.message}. Type your song name again!`;
  }
};

//
const generateMarkup = (data) => {
  songsContainer.innerHTML = ` <h1>Your search for
   '${firstLetter(input.value)}' is here! Enjoy!</h1>
  <ul>
 

  ${data.data.map((song, i) => {
    return ` <li>
    <span><strong>${i + 1} - ${song.title}-${song.artist.name}</strong></span>
   
    <span class="get-lyrics" onclick="getLyrics('${song.artist.name}','${
      song.title
    }')">Get lyrics!</span>
  </li>`;
  })}
 
</ul>


${
  data.prev
    ? `<button class="prev" onclick= "moreOrLess('${data.prev}')"><i class="fas fa-angle-left"></i></button>`
    : ""
}
${
  data.next
    ? `<button class="next" onclick="moreOrLess('${data.next}')"><i class="fas fa-angle-right"></i></button>`
    : ""
}

`;
};

// Turning every first letter of the word from search input to upperCase
const firstLetter = (str) => {
  let newStr = str.split(" ");
  let final = [];
  newStr.forEach(function (item) {
    //console.log(item[0].toUpperCase(),item.slice(1).toLowerCase());
    final.push(item[0].toUpperCase() + item.slice(1).toLowerCase());
  });
  return final.join(" ");
};
/*
const firstLetter = (str) => {
  let firstLetter;
  let restOfTheWord;
  let final = [];
  const newArr = str.split(" ");
  for (let i = 0; i < newArr.length; i++) {
    firstLetter = newArr[i].charAt(0).toUpperCase();
    restOfTheWord = newArr[i].slice(1).toLowerCase();

    final.push(firstLetter + restOfTheWord);
  }
  return final.join(" ");
};
*/

// Making request for the next button and the prev button
const moreOrLess = async (url) => {
  try {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
    console.log(data);

    generateMarkup(data);
  } catch (err) {
    errorNext.innerHTML = ` Something went wrong💥Click
    <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank"
      >here </a
    >to make this button work!<strong> Failed to load resource: the server responded with a status of 403 (Forbidden)</strong>.`;
  }
};

// Fetching the lyrics for a certain song
const getLyrics = async (artist, title) => {
  try {
    const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
    const data = await res.json();
    console.log(data);
    generateMarkupLyrics(data);
  } catch (err) {
    lyricsContainer.innerHTML = `<h5>Lyrics not found!</h5>
    <div class="get-lyrics-container"> 
    <button class="btn-lyrics" onclick='btnLyrics()'><i class="fas fa-angle-left"></i></button>`;
  }
};

const generateMarkupLyrics = (lyrics) => {
  let result = lyrics.lyrics;

  if ((songsContainer.style.display = "none"))
    lyricsContainer.style.display = "block";
  lyricsContainer.innerHTML = `
  <div class="get-lyrics-container"> 
  <button class="btn-lyrics" onclick='btnLyrics()'><i class="fas fa-angle-left"></i></button>
  
  ${lyricsRegex(result)}
  </div>
  `;
};

//Regex for lyrics.It will transform the lyrics coming from API to a true lyrics format.
const lyricsRegex = (song) => {
  return song.replace(/(\r\n|\r|\n)/g, "<br>");
};
const btnLyrics = () => {
  songsContainer.style.display = "block";
  lyricsContainer.style.display = "none";
};
