// Steps to complete:
/*
1. Create Firebase link
2. Get a snapshot of the current data and display the schedule
3. Create button for adding new trains - then update the html + update the database
4. Create a way to retrieve trains from the train database.
5. Create a way to calculate the minutes away. Using difference between next arrival and current time. Then use moment.js formatting to set difference in months.

*/

// 1. Link to Firebase
var trainData = new Firebase("https://sac-train-scheduler.firebaseio.com/");

// 2. At the initial load, get a snapshot of the current data.
trainData.on("value", function(snapshot) {

  // If there are trains scheduled, then display each one in the schedule
  if (snapshot.child("trainName").exists() && snapshot.child("destination").exists()) {

    snapshot.forEach(function(data) {

	   // Set the initial variables for train equal to the stored values.
	    trainName = snapshot.val().trainName;
	    destination = snapshot.val().destination;
	    firstTrainTime = snapshot.val().trainTime;
	    frequency = snapshot.val().frequency;
///
	    // Change the HTML to reflect the initial value
	    $('#trainName').html(trainName);
	    $('#destination').html(destination);
	    $('#firstTrainTime').html(trainTime);
	    $('#frequency').html(frequency);
///
	    // Print the initial data to the console.
	    console.log(trainName);
	    console.log(destination);
	    console.log(firstTrainTime);
	    console.log(frequency);
    });
  }
  // There are no trains scheduled to be displayed
  else{
    console.log("No Trains Currently Scheduled");
  }

// If any errors are experienced, log them to console. 
}, function (errorObject) {

    console.log("The read failed: " + errorObject.code);

});

// 3. Button for adding Trains
$("#addTrainBtn").on("click", function(){

	// Grabs user input
	var trainName = $("#trainNameInput").val().trim();
	var destination = $("#destinationInput").val().trim();
	var trainTime = moment($("#trainTimeInput").val().trim(), "HHmm").format("HH:mm");
	var frequency = $("#frequencyInput").val().trim();

	// Creates local "temporary" object for holding train data
	var newTrain = {
		trainName:  trainName,
		destination: destination,
		trainTime: trainTime,
		frequency: frequency
	};

	// Uploads train data to the database
	trainData.push(newTrain, function(errorObject) {

      if (errorObject) {
        console.log('Push failed');
      } else {
        console.log('Push succeeded');
      }
    });;

	// Logs everything to console
	console.log(newTrain.trainName);
	console.log(newTrain.destination);
	console.log(newTrain.trainTime);
	console.log(newTrain.frequency);

	// Clears all of the text-boxes
	$("#trainNameInput").val("");
	$("#destinationInput").val("");
	$("#trainTimeInput").val("");
	$("#frequencyInput").val("");

	// Prevents moving to new page
	return false;
});

// 3. Create Firebase event for adding a train to the database and a row in the html when a user adds an entry
trainData.on("child_added", function(childSnapshot, prevChildKey){

	console.log("initial data loaded!");

	// Store everything into a variable.
	var trainName = childSnapshot.val().trainName;
	var destination = childSnapshot.val().destination;
	var trainTime = childSnapshot.val().trainTime;
	var frequency = parseInt(childSnapshot.val().frequency);

	// Train Info
	console.log(trainName);
	console.log(destination);
	console.log(trainTime);
	console.log(frequency);

	// The time stored in the db is only hour:min.  There is no date so the format "HHmm" must
	// be passed in so that it knows that it is only the time portion of a date/time string.
	// moment will use today's date as the default.  If the format is not included then moment
	// defaults to the current time.
	var startTime = moment(trainTime, "HHmm");

	// Get the total number of minutes since the train started running.
	// This call gets the difference between the current time and the start time
	// in minutes.  A number will be returned from moment().diff() NOT a moment and NOT a string
	var minutesFromStart = (moment().diff(moment(startTime), "minutes"));

	// Get the number of minutes that have elapsed since the last train stopped.
	var minutesSinceLastTrain = minutesFromStart % frequency;

	// Calculate the minutes away
	var minutesAway = frequency - minutesSinceLastTrain;

	// Next Arrival = current time + minutes away. Get the time in minutes to
	// use regular math.
	var currentTimeInMinutes = moment().minutes() + moment().hour() * 60;  // today's date now
	var nextArrival = currentTimeInMinutes + minutesAway;

	// At this point, nextArrival is the total number of minutes making up
	// the time.  Ex. if the next arrival is 12:15 then, nextArrival = 12 * 60 + 15.
	// Now we need to get the hour and minutes and concatenate them into a time string
	var hour = Math.floor(nextArrival / 60);
	var min = nextArrival % 60;
	var nextArrivalString = hour + ":" + min;

	// Add each train's data into the table
	$("#trainSchedule > tbody").append("<tr><td>" + trainName + 
										"</td><td>" + destination + 
										"</td><td>" + frequency + 
										"</td><td>" + moment(nextArrivalString, "HHmm").format("hh:mm A") + 
										"</td><td>" + minutesAway + 
										"</td></tr>");
});
