$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCdiaFgTvKw8mNgG3iSKf5lWCAJmnONwSo",
        authDomain: "trainschedule-a62b4.firebaseapp.com",
        databaseURL: "https://trainschedule-a62b4.firebaseio.com",
        projectId: "trainschedule-a62b4",
        storageBucket: "",
        messagingSenderId: "855781307726"
    };
    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();


    var name = "";
    var destination = "";
    var frequency;
    var firstTrain = "";
    var minutesTillTrain;
    var nextTrain;



    function clearInputs() {
        $("#trainName").val("");
        $("#trainDestination").val("");
        $("#firstTrain").val("");
        $("#trainFrequency").val("");
    }


    function createRow(name, dest, freq, ft, mtt) {
        name = $("<td>").text(name);
        destination = $("<td>").text(dest);
        frequency = $("<td>").text(freq);
        firstTrain = $("<td>").text(ft);
        minutesTillTrain = $("<td>").text(mtt);
        nextTrain = $("<td>").text(nextTrain);


        var tBody = $("tbody");
        var tRow = $("<tr>");

        tRow.append(name, destination, frequency, nextTrain, minutesTillTrain);
        tBody.append(tRow);
    }

    $("#add-train").on("click", function (event) {
        // Prevents the default button action, which is not what we want it to do
        event.preventDefault();

        name = $("#trainName").val().trim();
        destination = $("#trainDestination").val().trim();
        firstTrain = $("#firstTrain").val().trim();
        frequency = $("#trainFrequency").val().trim();


        // Code for "Setting values in the database"
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency
        });

        clearInputs();

    });



    // Firebase watcher + initial loader HINT: .on("value")
    database.ref().on("child_added", function (childSnapshot) {

        console.log(name, destination, firstTrain, frequency);

        var firstTrainConvert = moment(childSnapshot.val().firstTrain, "HH:mm").subtract(1, "years");


        // Difference between the times
        var differenceTime = moment().diff(moment(firstTrainConvert), "minutes");

        // Time apart (remainder)
        var trainRemainder = differenceTime % childSnapshot.val().frequency;

        // Minute Until Train
        minutesTillTrain = childSnapshot.val().frequency - trainRemainder;

        // Next Train
        nextTrain = moment().add(minutesTillTrain, "minutes").format("hh:mm");
 


        console.log(childSnapshot.val());
        console.log(childSnapshot.val().name);
        console.log(childSnapshot.val().destination);
        console.log(childSnapshot.val().firstTrain);
        console.log(childSnapshot.val().frequency);


        createRow(childSnapshot.val().name, childSnapshot.val().destination, childSnapshot.val().frequency, nextTrain, minutesTillTrain);
        console.log("Minutes till train " + minutesTillTrain);
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

});