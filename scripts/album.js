// getSongNumberCell(currentlyPlayingSongNumber);
// $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');



var setSong = function(songNumber) {
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
    
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber -1];
currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         formats: [ 'mp3' ],
         preload: true
     });
    setVolume(currentVolume);
};
var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');

};


var createSongRow = function(songNumber, songName, songLength) {

   var template =
      '<tr class="album-view-song-item">' +
      '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
      '  <td class="song-item-title">' + songName + '</td>' +
      '  <td class="song-item-duration">' + songLength + '</td>' +
      '</tr>';

  var $row = $(template);

  var clickHandler = function(){

    var $songDataAttr = parseInt($(this).attr('data-song-number'));

    // If a song is currently playing, revert that song button to the song's number
    if ( currentlyPlayingSongNumber !== null ) {

      var previouslyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);

      previouslyPlayingCell.html(currentlyPlayingSongNumber);

    }

    // If song clicked is not the currentlyPlayingSong, make it the currentlyPlayingSong and
    // display a pause button
    if (currentlyPlayingSongNumber !== $songDataAttr ){

      $(this).html(pauseButtonTemplate);
      setSong($songDataAttr);
        currentSoundFile.play();

      // Store the currently playing song name and length object
      

      // Display current song info in player bar
      updatePlayerBarSong();

    // If clicking the currently playing song, revert the currentlyPlayingSong to null and
    // display the play button
    } else if (currentlyPlayingSongNumber === $songDataAttr ) {
      if (currentSoundFile.isPaused()) {
             $(this).html(pauseButtonTemplate);
             $('.main-controls .play-pause').html(playerBarPauseButton);
              currentSoundFile.play();
      } else {
              $(this).html(playButtonTemplate);
              $('.main-controls .play-pause').html(playerBarPlayButton);
              currentSoundFile.pause();   
           }
    }
  };

  var onHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));

      if (songNumber !== currentlyPlayingSongNumber) {
          songNumberCell.html(playButtonTemplate);
      }
  };

  var offHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));

      if (songNumber !== currentlyPlayingSongNumber) {
          songNumberCell.html(songNumber);
      }
  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;

};

var setCurrentAlbum = function(album) {

  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.name);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  // Loop through each song in the album
  for (i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
    $albumSongList.append($newRow);
  }

};

// Helper method to return the index of a song in the album's songs array
var trackIndex = function(album, song){
    return album.songs.indexOf(song);
};

var nextSong = function() {

  // Function to help get the last song number so that we can
  // update the HTML of the previous song's number
  var getLastSongNumber = function(index) {
    return index === 0 ? currentAlbum.songs.length : index;
  };

  // Use the trackIndex() helper function to get the index of the current song and
  // then increment the value of the index.
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex++;

  // If it's the last song, wrap it back around to the first song in the index
  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }

  // Set the new currently playing song number. Adding 1 to account for array starting at 0.
  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updatePlayerBarSong();
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

  // Update the Player Bar information
  $('.currently-playing .song-name').text(currentSongFromAlbum.name);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
  $('.left-controls .play-pause').html(playerBarPauseButton);

  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);

};

var previousSong = function() {

    var getLastSongNumber = function(index) {
      return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;

    if (currentSongIndex < 0) {
      currentSongIndex = currentAlbum.songs.length - 1;
    }

    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updatePlayerBarSong();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
    $('.left-controls .play-pause').html(playerBarPauseButton);

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

var updatePlayerBarSong = function(){

  // Set the content of the current song playing in the player bar
  $('.currently-playing .song-name').text(currentSongFromAlbum.name);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);

  // Change the play button to a pause button for the currently playing song
  $('.main-controls .play-pause').html(playerBarPauseButton);

};

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// Store state of songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready( function() {

  setCurrentAlbum(albumPicasso);

  $previousButton.click(previousSong);
  $nextButton.click(nextSong);

});