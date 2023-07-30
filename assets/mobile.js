const mobileSelectAlarm = document.querySelectorAll(".select");
const mobileSetAlarmBtn = document.querySelector(".mobile-set-alarm-btn");
const mobileSelectedTimeBox = document.querySelector(".mobile-selected-time-box");
const timeBox = document.querySelector(".time-box");

// Function to add leading zero to single-digit numbers
function addZero(num) {
    return (parseInt(num, 10) < 10 ? '0' : '') + num;
}

// Function to update the clock and date in the mobile interface
function mobileUpdateTime() {
    // Get references to clock and date elements
    var mobileClockElement = document.getElementById('mobile-clock');
    var mobileDateElement = document.getElementById('mobile-date');

    // Get the current date and time
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    // Format the time and date
    var currentTime = addZero(hours) + ':' + addZero(minutes) + ':' + addZero(seconds) + ' ' + ampm;
    var currentDateString = date.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    // Update the clock and date elements
    mobileClockElement.textContent = currentTime;
    mobileDateElement.textContent = currentDateString;

    // Call the function again after 1 second to update the time
    setTimeout(mobileUpdateTime, 1000);
}

// Start updating the mobile clock and date
mobileUpdateTime();

// Function to populate select options (e.g., hours, minutes, seconds)
function populateSelectOptions(selectElement, start, end) {
    for (var i = start; i <= end; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.textContent = addZero(i);
        selectElement.appendChild(option);
    }
}
// Populate select options for alarm hours, minutes, and seconds
populateSelectOptions(document.getElementById('mobile-alarmhrs'), 0, 12);
populateSelectOptions(document.getElementById('mobile-alarmmins'), 0, 59);
populateSelectOptions(document.getElementById('mobile-alarmsecs'), 0, 59);


// Function to change the selected music for the alarm
var sound = new Audio();
sound.loop = true;
var mobileMusicDropdown = document.getElementById('mobile-music-dropdown');

function mobileChangeMusic() {
  var mobileSelectedValue = mobileMusicDropdown.value;
  if (mobileSelectedValue === 'mobile-local-music') {
    // Trigger the file input to handle the local music upload
    document.getElementById('mobile-local-music').click();
  } else {
    sound.src = mobileSelectedValue;
    sound.play();
  }
}

// Function to handle the selected music file upload
function mobileHandleFileSelect(e){
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const musicDataUrl = e.target.result;
    sound.src = musicDataUrl;
    sound.play();
    sound.loop = true;
  };

  if (file) {
    reader.readAsDataURL(file);
    // Store the selected file name in a variable
    const mobileSelectedMusicName = file.name;
    // Update the text content of the "selected-music-name" element
    document.getElementById('mobile-selected-music-name').textContent = mobileSelectedMusicName;
  }

}

// Function to change the volume of the alarm sound
function mobileChangeVolume(action) {
  var volume = sound.volume;
  if (action === 'up') {
      volume += 0.1;
      if (volume > 1) {
          volume = 1;
      }
  } else if (action === 'down') {
      volume -= 0.1;
      if (volume < 0) {
          volume = 0;
      }
  }
  sound.volume = volume;
}


// Function to set the mobile alarm
function mobileAlarmSet() {
  // Get alarm hours, minutes, seconds, and AM/PM from the input elements
  var alarmHrs = document.getElementById('mobile-alarmhrs').value;
  var alarmMins = document.getElementById('mobile-alarmmins').value;
  var alarmSecs = document.getElementById('mobile-alarmsecs').value;
  var alarmAMPM = document.getElementById('mobile-ampm').value;
  var alarmDay = document.getElementById('mobile-alarmday').value;
  var mobileSelectedValue = mobileMusicDropdown.value;


 if (mobileSelectedValue === 'mobile-local-music') {
  mobileSelectedValue = sound.src;
}

  // Create a new Date object for the alarm time
  var now = new Date();
  var alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), alarmHrs, alarmMins, alarmSecs);

  // Adjust the alarm time based on AM/PM selection
  if (alarmAMPM === 'PM' && alarmHrs !== '12') {
    alarmTime.setHours(alarmTime.getHours() + 12);
  } else if (alarmAMPM === 'AM' && alarmHrs === '12') {
    alarmTime.setHours(alarmTime.getHours() - 12);
  }

  // Check if the selected day is "Everyday"
  if (alarmDay === 'Everyday') {
    // Set the alarm to trigger every day at the specified time
    alarmTime.setDate(now.getDate());
    if (alarmTime <= now) {
      alarmTime.setDate(alarmTime.getDate() + 1); // Move to the next day if the time has already passed for today
    }

    var timeDifference = alarmTime.getTime() - now.getTime();
    setTimeout(function () {
      sound.src = mobileSelectedValue;
      sound.play();
      sound.loop = true;
      timeBox.classList.add("alarm-active");
      alert('Everyday Alarm!');
    }, timeDifference);
  } else {
    // specific day is selected,
    var selectedDayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(alarmDay);
    var currentDayIndex = now.getDay();
    var dayDifference = (selectedDayIndex - currentDayIndex + 7) % 7;
    alarmTime.setDate(now.getDate() + dayDifference);

    // time difference between the current time and alarm time
    var timeDifference = alarmTime.getTime() - now.getTime();
    if (timeDifference <= 0) {
      alert('Invalid alarm time!');
      return;
    }

    // Set the alarm to trigger after the calculated time difference
    setTimeout(function () {
      sound.src = mobileSelectedValue;
      sound.play();
      sound.loop = true;
      timeBox.classList.add("alarm-active");
      alert('Alarm on ' + alarmDay + '!');
    }, timeDifference);
  }
}


// Function to clear the mobile alarm
function mobileAlarmClear() {
    sound.pause();
    sound.currentTime = 0;
    timeBox.classList.remove("alarm-active");
}




/* create alarmSelectedItem and clear btn */
function createMobileAlarmSelectedItem(time) {
  let mobileAlarmSelectedItem = document.createElement("div");
  let musicName = mobileMusicDropdown.options[mobileMusicDropdown.selectedIndex].text;
  
  mobileAlarmSelectedItem.innerHTML = `${time} - ${musicName} <button class="mobile-clear-alarm-btn">Clear Alarm</button>`;
  mobileSelectedTimeBox.appendChild(mobileAlarmSelectedItem);
}


// Clear the alarm by clicking the "Clear Alarm" button
mobileSelectedTimeBox.addEventListener("click", (e) => {
    if (e.target.classList.contains("mobile-clear-alarm-btn")) {
        e.target.parentElement.remove();
    }
    sound.pause();
    sound.currentTime = 0;
    mobileSetAlarmBtn.classList.remove("disable");
    timeBox.classList.remove("alarm-active");
});

// Set alarm by clicking the "Set Alarm" button
mobileSetAlarmBtn.addEventListener("click", () => {
  // Get alarm hours, minutes, seconds, and AM/PM from the input elements
  var alarmHrs = mobileSelectAlarm[0].value;
  var alarmMins = mobileSelectAlarm[1].value;
  var alarmSecs = mobileSelectAlarm[2].value;
  var alarmAMPM = mobileSelectAlarm[3].value;
  var alarmDay = mobileSelectAlarm[4].value;
  

  // Format the selected alarm time
  var formattedTime = `${addZero(alarmHrs)}:${addZero(alarmMins)}:${addZero(alarmSecs)} ${alarmAMPM} <br> ${alarmDay}`;
  createMobileAlarmSelectedItem(formattedTime);
});
