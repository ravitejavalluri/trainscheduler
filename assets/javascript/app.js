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

	// Format the train start
//	var trainTimeFormat = moment.unix(trainTime).format("HH:mm");
	// Calculate next arrival and minutes away using hardcore math
	// To calculate the next arrival
	// ( Current Time - Start Time ) / Frequency == Number of Train Arrivals that
	// have passed.
	// (Frequency - remaining minutes ) == the amount of minutes until the next
	// arrival
//	var nextArrival = moment().subtract(moment.unix(trainTime, 'HH:mm'), "minutes");
	// Ignore correct usage of moment.js for now

	var currentTime = Date();
	var startTime = Date(trainTime);
	var interval = frequency;
	var remainingMinutes = (timeInMinutes(currentTime) - timeInMinutes(startTime)) % interval;
/*?*/	var nextArrival = currentTime + (interval - remainingMinutes);
	console.log("currentTime=" + moment(currentTime).format("hh:mm A"));
	console.log("startTime=" + moment(startTime).format("hh:mm A"));
	console.log("nextArrival=" + moment(nextArrival).format("hh:mm A"));
	console.log("interval=" + moment(interval).format("hh:mm A"));

	// Calculate the minutes away
	var minutesAway = nextArrival - currentTime;
	console.log("minutesAway=" + moment(minutesAway).format("hh:mm A"));

	// Add each train's data into the table
	$("#trainSchedule > tbody").append("<tr><td>" + trainName + 
										"</td><td>" + destination + 
										"</td><td>" + frequency + 
										"</td><td>" + moment(nextArrival).format("hh:mm A") + 
										"</td><td>" + moment(minutesAway).format("mm") + 
										"</td></tr>");
});

function timeInMinutes(time) {

  return time.minutes() + time.hours() * 60;

}
// Example Time Math
// -----------------------------------------------------------------------------
// Assume Employee start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use mets this test case



