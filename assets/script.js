  // Toggle functionality for alarm buttons
  var buttons = document.querySelectorAll(".alarm-button");
  for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
          for (let j = 0; j < buttons.length; j++) {
              if (j !== i) {
                  buttons[j].classList.remove("toggle-button");
              }
          }
          buttons[i].classList.toggle("toggle-button");
      });
  }
  
  // Function to populate select element options
  function populateSelectOptions(selectElement, start, end) {
      for (var i = start; i <= end; i++) {
          var option = document.createElement('option');
          option.value = i;
          option.textContent = addZero(i);
          selectElement.appendChild(option);
      }
  }
  // Populate select options for hours, minutes, and seconds
  populateSelectOptions(document.getElementById('alarmhrs'), 1, 12);
  populateSelectOptions(document.getElementById('alarmmins'), 0, 59);
  populateSelectOptions(document.getElementById('alarmsecs'), 0, 59);
  
  // Helper function to add leading zero for time formatting
  function addZero(num) {
      return (parseInt(num, 10) < 10 ? '0' : '') + num;
  }
  
  // Update the clock and date elements every second
  function updateTime() {
      var clockElement = document.getElementById('clock');
      var dateElement = document.getElementById('date');
  
      var date = new Date();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      var ampm = hours >= 12 ? 'PM' : 'AM';
  
      hours = hours % 12;
      hours = hours ? hours : 12;
  
      var currentTime =
          addZero(hours) + ':' + addZero(minutes) + ':' + addZero(seconds) + ' ' + ampm;
  
      var currentDateString =
          date.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  
      clockElement.textContent = currentTime;
      dateElement.textContent = currentDateString;
  
      setTimeout(updateTime, 1000);
  }
  
  // Update time
  updateTime();
  
  var gifContainer  = document.querySelector('.gif-container');
  function alarmSet() {
      // Get alarm hours, minutes, seconds, and AM/PM from the input elements
      var alarmHrs = document.getElementById('alarmhrs').value;
      var alarmMins = document.getElementById('alarmmins').value;
      var alarmSecs = document.getElementById('alarmsecs').value;
      var alarmAMPM = document.getElementById('ampm').value;
      var alarmDay = document.getElementById('alarmday').value;
      var selectedValue = musicDropdown.value;
  
      if (selectedValue === 'local-music') {
          selectedValue = sound.src;
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
          sound.src = selectedValue;
          sound.play();
          sound.loop = true;
          gifContainer.classList.add("alarm-active");
          alert('Everyday Alarm!');
        }, timeDifference);
      } else {
        // specific day is selected
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
          sound.src = selectedValue;
          sound.play();
          sound.loop = true;
          gifContainer.classList.add("alarm-active");
          alert('Alarm on ' + alarmDay + '!');
        }, timeDifference);
      }
    }
    
    
  
  // Clear the alarm
  function alarmClear() {
      sound.pause();
      sound.currentTime = 0;
      gifContainer.classList.remove("alarm-active");
  
  }
  
  // Audio Setup and Music Dropdown
  var sound = new Audio();
  sound.loop = true;
  var musicDropdown = document.getElementById('music-dropdown');
  
  // Function to change the currently playing music
  function changeMusic() {
      var selectedValue = musicDropdown.value;
      if (selectedValue === 'local-music') {
          // Trigger the file input to handle the local music upload
          document.getElementById('local-music').click();
        } else {
          sound.src = selectedValue;
          sound.play();
        }
  }
  
  function handleFileSelect(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
    
      reader.onload = function (event) {
        const musicDataUrl = event.target.result;
        sound.src = musicDataUrl;
        sound.play();
        sound.loop = true;
      };
    
      if (file) {
        reader.readAsDataURL(file);
        // Store the selected file name in a variable
        const selectedMusicName = file.name;
        // Update the text content of the "selected-music-name" element
        document.getElementById('selected-music-name').textContent = selectedMusicName;
      }
    
    }
    
  
  // Function to change the volume of the audio
  function changeVolume(action) {
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
  
  // Set up event listeners for alarm-related functionality
  const addAlarmBtn = document.querySelector(".add-alarm-btn");
  const selectedTimeBox = document.querySelector(".selected-time-box");
  const alarmSelect = document.querySelectorAll("select");
  
  
  
  // Create alarmSelectedItem and clear btn
  function createAlarmSelectedItem(time) {
      const alarmSelectedItem = document.createElement("div");
      let musicName = musicDropdown.options[musicDropdown.selectedIndex].text;
  
      alarmSelectedItem.innerHTML = `${time} - ${musicName} <button class="clear-alarm-btn">Clear Alarm</button>`;
      selectedTimeBox.appendChild(alarmSelectedItem);
  }
  
  // Clear alarm by clicking on the "Clear Alarm" btn
  selectedTimeBox.addEventListener("click", (e) => {
      if (e.target.classList.contains("clear-alarm-btn")) {
          e.target.parentElement.remove();
      }
      sound.pause();
      gifContainer.classList.remove("alarm-active");
      sound.currentTime = 0;
  });
  
  // Set alarm by clicking the "Set Alarm" button
  addAlarmBtn.addEventListener("click", () => {
      // Get alarm hours, minutes, seconds, and AM/PM from the input elements
      var alarmHrs = alarmSelect[0].value;
      var alarmMins = alarmSelect[1].value;
      var alarmSecs = alarmSelect[2].value;
      var alarmAMPM = alarmSelect[3].value;
      var alarmDay = alarmSelect[4].value;
      
    
      // Format the selected alarm time
      var formattedTime = `${addZero(alarmHrs)}:${addZero(alarmMins)}:${addZero(alarmSecs)} ${alarmAMPM} <br> ${alarmDay}`;
      createAlarmSelectedItem(formattedTime);
    });