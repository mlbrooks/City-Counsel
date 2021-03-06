var cityName = "";
var cityNum = 0;
var currentCity = {};
var cityLat = 0;
var cityLon = 0;
var startDate = "";

$("#searchButton").on("click", function (event) {
    event.preventDefault();
    $("#eventsCard").toggleClass("d-none", false);
    // initialize table
    $("#eventsCardRow").empty();
    // Get the inputs from the city select
    cityName = $("#inputCity").val();
    // function that will return the selected city object from the cityArray
    function getCity() {
        cityNum = cityNameArray.indexOf(cityName);
        currentCity = cityArray[cityNum];
    }

    // calling the getCity function
    getCity();

    cityLat = currentCity.lat;
    cityLon = currentCity.lon;
    startDate = (moment().add(1, 'days')).format('YYYY-MM-DD') + "T" + moment.utc().format('HH:mm:ss') + "Z";

    var apiKey = "L33YkC9wH8KXB7RNBA4rbkakkaT9iKFP";
    var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + apiKey + "&latlong=" + cityLat + "," + cityLon + "&radius=30&sort=date,asc&size=8&startDateTime=" + startDate;

    function getEvents() {
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            var events = response._embedded.events;

            // looping over response to create cards to display response in the event table
            for (var i = 0; i < events.length; i++) {
                // create columns for the cards with responsive widths
                var eventCol = $("<div>");
                eventCol.addClass("col-sm-6");
                eventCol.addClass("col-md-4");
                eventCol.addClass("col-lg-3");
                eventCol.addClass("col-xl-3");
                eventCol.addClass('mb-2');
                //create the card itself
                var eventDiv = $("<div>")
                eventDiv.attr("eventNum", i + 1);
                eventDiv.addClass("card")
                eventDiv.addClass("h-100")
                //variables for concert time to be displayed
                var localDay = moment(events[i].dates.start.localDate).format('dddd')
                var localDate = moment(events[i].dates.start.localDate).format('MMMM DD');
                var localTime = moment(events[i].dates.start.localTime, 'HH:mm:ss').format('h:mma');
                //exception handling in case of no time listed
                if (localTime === "Invalid date") {
                    localTime = ""
                }
                //set the URL image to empty
                var eventImgURL = "";
                //for loop to try to limit images to 16x9 aspect ratio, this property is often mislabeled in the API results though. 
                //this is inelegant because it will go through all of the images and just use the last 16x9. may revisit to come up with a more elegant solution.
                for (var j = 0; j < events[i].images.length; j++) {

                    if (events[i].images[j].ratio = "16_9") {
                        eventImgURL = events[i].images[j].url
                    };
                };
                //url to buy tickets. this functionality is also dodgy within the API results.
                var eventURL = events[i].url;
                //create a card header image that is also a link to the concert page
                var eventImg = $('<a href="' + eventURL + '" target="_blank"><img class="card-img-top img-responsive" src="' + eventImgURL + '"></a>')
                // create card body
                var eventCardBody = $('<div class="card-body d-flex flex-column">')
                // display event name as card title
                var eventName = "<h4 class='card-title'>" + events[i].name;
                "</h4>" + "<br>"
                // display date with float left and float right
                var eventDate = "<div><h5 class='small'>" + localDate + "</h5></div><h5>" + localDay + "</h5>"

                var eventDay = "<div class='mt-auto'><h5>" + localTime + "</h5></div>"

                // display venue
                var eventVenue = '<div class="text-truncate">' + events[i]._embedded.venues[0].name + "<br>"

                // display address below
                var eventAddress = "<p class='text-truncate small'>" + events[i]._embedded.venues[0].address.line1 + ", " + events[i]._embedded.venues[0].city.name + "</p></div></div>"

                // add all the data to the row

                eventDiv.append(eventImg);
                eventCardBody.append(eventName);
                eventCardBody.append(eventDate);
                eventCardBody.append(eventDay);
                eventCardBody.append(eventVenue);
                eventCardBody.append(eventAddress);
                // eventCardBody.append(eventPrice);
                eventDiv.append(eventCardBody)
                eventCol.append(eventDiv)

                // add the row to the table
                $("#eventsCardRow").append(eventCol);
            }
        });
    }

    getEvents();
})