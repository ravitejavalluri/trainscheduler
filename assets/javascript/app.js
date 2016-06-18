var TrainScheduler = {

  // Initial Values for a new train
  trainName: "",
  destination: "",

  firstTrainTime: "00:00",
  frequency: "00:00",

  // counter for views
  viewCounter: 0,

  displaySchedule: function(train, id){
    // Create a div for each data value for the current train and append it to the schedule div
    // Append the div in the appropriate column div, i.e. id="trainNameCol"
    // Ex: <h6 id="trainName-1">Santa Express</h6>

    // Train Name
    var trainNameDiv = $("<h6>");
    
    trainNameDiv.addClass("#trainName-" + id);
    trainNameDiv.append(train.val().trainName);

    $("#trainNameCol").append(trainNameDiv);

    // Train Destination
    var trainDestDiv = $("<h6>");
    
    trainDestDiv.addClass("#destination-" + id);
    trainDestDiv.append(train.val().destination);

    $("#destinationCol").append(trainDestDiv);

    // Train Frequency
    var trainFreqDiv = $("<h6>");
    
    trainFreqDiv.addClass("#frequency-" + id);
    trainFreqDiv.append(train.val().frequency);

    $("#frequencyCol").append(trainFreqDiv);

    // Next Arrival
    var nextArrivalDiv = $("<h6>");
    
    nextArrivalDiv.addClass("#nextArrival-" + id);
    nextArrivalDiv.append(train.val().nextArrival);

    $("#nextArrivalCol").append(nextArrivalDiv);

    // Minutes Away
    var minutesAwayDiv = $("<h6>");
    
    minutesAwayDiv.addClass("#nextArrival-" + id);
    minutesAwayDiv.append(train.val().nextArrival + train.val().frequency);

    $("#nextArrivalCol").append(minutesAwayDiv);
  },

  addTrain: function() {

    // Get the input values
    var trainName = $('#trainName').val().trim();
    var destination = $('#destination').val().trim();
    var trainTime = $('#trainTime').val().trim();
    var frequency = $('#frequency').val().trim();

    // Log the Train data
    console.log(trainName);
    console.log(destination);
    console.log(trainTime);
    console.log(frequency);

    // Save the new price in Firebase
    trainData.set({
      trainName: trainName,
      destination: destination,
      trainTime: trainTime,
      frequency: frequency
    }, function(errorObject) {
      if (errorObject) {
        console.log('Synchronization failed');
      } else {
        console.log('Synchronization succeeded');
      }
    });

    // Change the HTML to reflect the new train data
//  $("#trainName").html(bidderName);
//  $("#highestPrice").html("$" +  bidderPrice);
  },
};

// ------------  FUNCTIONS  -------------------------------------------    

// Link to Firebase
var trainData = new Firebase("https://sac-train-scheduler.firebaseio.com/");
var trainCount = 0;

// At the initial load, get a snapshot of the current data.
trainData.on("value", function(snapshot) {

  // If there are trains scheduled, then display each one in the schedule
  if (snapshot.child("trainName").exists() && snapshot.child("destination").exists()) {

    snapshot.forEach(function(data) {

      TrainScheduler.displaySchedule(data, trainCount++);

/* Replace this with one call to displaySchedule with the data for
 * the current train retrieved from the database.  Pass the count
 * along so displaySchedule can create a unique id for the html where
 * the data will be displayed.

    // Set the initial variables for highBidder equal to the stored values.
    trainName = snapshot.val().trainName;
    destination = snapshot.val().destination;
    firstTrainTime = "00:00" // for now. later use moments.js to format for military time
    frequency = "00:00" // use moments.js

    // Change the HTML to reflect the initial value
    $('#trainName').html(snapshot.val().trainName);
    $('#destination').html(snapshot.val().destination);
    $('#firstTrainTime').html(snapshot.val().firstTrainTime);
    $('#frequency').html(snapshot.val().frequency);

    // Print the initial data to the console.
    console.log(snapshot.val().trainName);
    console.log(snapshot.val().destination);
    console.log(snapshot.val().firstTrainTime);
    console.log(snapshot.val().frequency);
    }
*/
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

trainData.on("child_added", function(snapshot, prevChildKey) {
  var newTrain = snapshot.val();

  TrainScheduler.displaySchedule(newTrain, trainCount++);

});

// --------------------------------------------------------------

// Whenever a user clicks the submit button
$("#addTrain").on("click", function() {

  TrainScheduler.addTrain();


  // Return False to allow "enter"
  return false;
});

var onComplete = function(error) {
  if (error) {
    console.log('Synchronization failed');
  } else {
    console.log('Synchronization succeeded');
  }
};



