"use strict";
// avoid warnings on using fetch and Promise --
/* global fetch, Promise */
// use port 80, i.e., apache server for webservice execution
const baseUrl = "http://localhost/cs637/wasajana/pizza2_server/api";
// globals representing state of data and UI
let selectedUser = 'none';
let sizes = [];
let toppings = [];
let users = [];
let orders = [];
let main = function () {//(sizes, toppings, users, orders) {
    setupTabs();  // for home/order pizza and meat/meatless
    // for home tab--
    displaySizesToppingsOnHomeTab();
    setupUserForm();
    setupRefreshOrderListForm();
    setupAcknowledgeForm();
    displayOrders();
    // for order tab--
    setupOrderForm();
    displaySizesToppingsOnOrderForm();
};

function displaySizesToppingsOnHomeTab() {
    // find right elements to build lists in the HTML
    // loop through sizes, creating <li>s for them
    // with class=horizontal to get them to go across horizontally
    // similarly with toppings
    // console.log("hello");
    for (var i = 0; i < sizes.length; i++) {
        var size = document.getElementById("sizes");
        var x = sizes[i].size;
        size.appendChild(document.createTextNode(x)); 
        size.appendChild (document.createTextNode("\u00A0\u00A0\u00A0"));   
    }
    for (var i = 0; i < toppings.length; i++) {
        var topp = document.getElementById("toppings");
        var x = toppings[i].topping;
        topp.appendChild(document.createTextNode(x + "\u00A0\u00A0"));    
    }
}

function setupUserForm() {
    // find the element with id userselect
    // create <option> elements with value = username, for
    // each user with the current user selected,
    // plus one for user "none".
    // Add a click listener that finds out which user was
    // selected, make it the "selectedUser", and fill it in the
    //  "username-fillin" spots in the HTML.
    //  Also change the visibility of the order-area
    // and redisplay the orders

    var x = document.getElementById("userselect");
    for (var i = 0; i < users.length; i++) {
        var hor = document.createElement("option");
        hor.text = users[i].username;
        // hor.appendChild(document.createTextNode(x));
        x.add(hor);
    }
}
function setupAcknowledgeForm() {
    console.log("setupAckForm...");
    document.querySelector("#ackform input").addEventListener("click", function () {
        // $("#ackform input").on("click", function () {
        console.log("ack by user = " + selectedUser);
        orders.forEach(function (order) {
            if (order.username === selectedUser && order.status === 'Baked') {
                console.log("Found baked order for user " + order.username);
                order.status = 'Finished';
                updateOrder(order); // post update to server
            }
        });
        displayOrders(orders);
        return false;
    });
}
function setupRefreshOrderListForm() {
    console.log("setupRefreshForm...");
    document.querySelector("#refreshbutton input").addEventListener("click", function () {
        //  $("#refreshbutton input").on("click", function () {
        console.log("refresh orders by user = " + selectedUser);
        getOrders();
        return false;
    });
}
function displayOrders() {
    console.log("displayOrders");

    // remove class "active" from the order-area
    // if selectedUser is "none", just return--nothing to do
    // empty the ordertable, i.e., remove its content: we'll rebuild it
    // add class active to order-area
    // find the user_id of selectedUser via the users array
    // find the in-progress orders for the user by filtering array
    // orders on user_id and status
    // if there are no orders for user, make ordermessage be "none yet"
    //  and remove active from element id'd order-info
    // Otherwise, add class active to element order-info, make
    //   ordermessage be "", and rebuild the order table
    // Finally, if there are Baked orders here, make sure that
    // ackform is active, else not active
}

// Let user click on one of two tabs, show its related contents
// Contents for both tabs are in the HTML after initial setup,
// but one part is not displayed because of display:none in its CSS
// This implementation works for multiple two-tab setups because
// it works from the clicked-on element and finds the related
// content nearby. The related content needs to be a sibling of
// the clicked-on element's grandparent.
function setupTabs() {
    console.log("starting setupTabs");

    // Do this last. You may have a better approach, but here's one
    // way to do it. Also edit the html for better initial settings
    // of class active on these elements.
    // Find <span> elements inside <a>'s inside elements with class tabs
    // and process them as follows:  (there are four of them)
    // add a click listener to the element. When a click happens,
    // add class "active" to that element, and figure out this element's
    // parent's (the parent is an <a>) position among its siblings. If it
    // is the first child, the other <a> is its next sibling, and the other
    // <span> is the first child of that <a>. Similarly in the other case.
    // Remove class active from that other tab.
    // Now find the related tabContent element. It's the <span>'s
    // grandparent's next sibling, or sibling after that. Add class active
    // to the newly active one and remove it from the other one.

}

function displaySizesToppingsOnOrderForm() {
    console.log("displaySizesToppingsOnOrderForm");
    // find the element with id order-sizes, and loop through sizes,
    // setting up <input> elements for radio buttons for each size
    // and labels for them too
    // Then find the spot for meat toppings, and meatless ones
    // and for each create an <input> element for a checkbox
    // and a <label> for each
    for (var i = 0; i < sizes.length; i++) {
        var size = document.getElementById("order-sizes");
        var x = sizes[i].size;
        size.appendChild(document.createTextNode(x + '\u00A0\u00A0\u00A0'));    
    }


    // for (var i = 0; i < toppings.length; i++) {
    //     var topp = document.getElementById("meats");
    //     var type = toppings[i].is_meat
    //     if (type == 1) {
    //         var x = toppings[i].topping;
    //         topp.appendChild(document.createTextNode(x + '             '));
    //     }    
    // }

    // for (var i = 0; i < toppings.length; i++) {
    //     var topp = document.getElementById("meatlesses");
    //     var type = toppings[i].is_meat
    //     if (type == 0) {
    //         var x = toppings[i].topping;
    //         topp.appendChild(document.createTextNode(x + '             '));
    //     }    
    // }

    document.querySelectorAll(".tabs.meat-meatless a span").forEach(function (element) {
    // Code for page 139-140, to finish Chap. 4 Amazeriffic:
        element.addEventListener("click", function () {
            event.preventDefault();
            document.querySelectorAll(".tabs.meat-meatless a span").forEach(function (element) {
                element.classList.remove("active");
            });
            element.classList.add("active");
            document.querySelector("#meats").innerHTML = "";
            console.log("TAB clicked: " + element.innerHTML);
            let content;
            if (element.parentElement.matches(":nth-child(1)")) {
                console.log("in newest");
                // newest first, so we have to go through
                // the array backwards
                content = document.createElement("ul");
                for (let i = toppings.length - 1; i >= 0; i--) {
                    var topp = document.getElementById("meats");
                    var type = toppings[i].is_meat
                    if (type == 1) {
                        var x = toppings[i].topping;
                        content.innerHTML += "<li>" + x + "</li>";
                    }   
                }

            } else
            if (element.parentElement.matches(":nth-child(2)")) {
                content = document.createElement("ul");
                for (let i = toppings.length - 1; i >= 0; i--) {
                    var topp = document.getElementById("meatlesses");
                    var type = toppings[i].is_meat
                    if (type == 0) {
                        var x = toppings[i].topping;
                        content.innerHTML += "<li>" + x + "</li>";
                    }   
                }
            }
            document.querySelector("#meats").append(content);
        });
    });
    // simulate a click to fill in first-child content
    // document.querySelector(".tabs a:first-child span").click(); // insta refresh
}

function setupOrderForm() {
    console.log("setupOrderForm...");

    // find the orderform's submitbutton and put an event listener on it
    // When the click event comes in, figure out the sizeName from
    // the radio button and the toppings from the checkboxes
    // Complain if these are not specified, using order-message
    // Else, figure out the user_id of the selectedUser, and
    // compose an order, and post it. On success, report the
    // new order number to the user using order-message

}

// Plain modern JS: use fetch, which returns a "promise"
// that we can combine with other promises and wait for all to finish
function getSizes() {
    let promise = fetch(
            baseUrl + "/sizes",
            {method: 'GET'}
    )
            .then(response => response.json())  // successful fetch
            .then(json => {
                console.log("back from fetch: %O", json);
                sizes = json;
            })
            .catch(error => console.error('error in getSizes:', error));
    return promise;
}
// JQuery/Ajax: for use with $.when: return $.ajax object
function getSizes0() {
    return $.ajax({
        url: baseUrl + "/sizes",
        type: "GET",
        dataType: "json",
        //  headers: {"Content-type":"application/json"}, // needed
        success: function (result) {
            console.log("We did GET to /sizes");
            console.log(result);
            sizes = result;
        }
    });
}

function getToppings() {
    let promise = fetch(
            baseUrl + "/toppings",
            {method: 'GET'}
    )
            .then(response => response.json())
            .then(json => {
                console.log("back from fetch: %O", json);
                toppings = json;
            })
            .catch(error => console.error('error in getToppings:', error));
    return promise;
}

function getToppings0() {
    return $.ajax({
        url: baseUrl + "/toppings",
        type: "GET",
        dataType: "json",
        //  headers: {"Content-type":"application/json"}, // needed
        success: function (result) {
            console.log("We did GET to /toppings");
            console.log(result);
            toppings = result;
        }
    });
}

function getUsers() {
let promise = fetch(
            baseUrl + "/users",
            {method: 'GET'}
    )
            .then(response => response.json())
            .then(json => {
                console.log("back from fetch: %O", json);
                users = json;
            })
            .catch(error => console.error('error in getUsers:', error));
    return promise;
}

function getOrders() {

}
function updateOrder(order) {

}
function postOrder(order, onSuccess) {

}
function refreshData(thenFn) {
    // wait until all promises from fetches "resolve", i.e., finish fetching
    Promise.all([getSizes(), getToppings(), getUsers(), getOrders()]).then(thenFn);
    // JQuery way: wait for all these Ajax requests to finish
    // $.when(getSizes(), getToppings(), getUsers(), getOrders()).done(function (a1, a2, a3, a4) {
    //     thenFn();
    //});
}

console.log("starting...");
refreshData(main);
