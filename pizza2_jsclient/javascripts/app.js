"use strict";
// avoid warnings on using fetch and Promise --
/* global fetch, Promise */
// use port 80, i.e., apache server for webservice execution
const baseUrl = "http://topcat.cs.umb.edu/cs637/wasajana/pizza2_server/api";
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

    $('#userselect').append(users.map((user)=>{
        console.log(user);
        return $('<option />').val(user.id).text(user.username);
    }))
    // var x = document.getElementById("userselect");
    // for (var i = 0; i < users.length; i++) {
    //     var hor = document.createElement("option");
    //     hor.text = users[i].username;
    //     // hor.appendChild(document.createTextNode(x));
    //     x.add(hor);
    

    // Jquery
    $('#userselectsubmit').on("click", function (event){
      event.preventDefault();
      let userid = $('#userselect').val();
      let selectedUser = $('#userselect option:selected').text();
      $("#username-fillin1, #username-fillin2").html(selectedUser);
      $("#order-area").addClass("active");
      displayOrders(userid);
    });
    // alert(selectedOption);
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
        displayOrders();
        return false;
    });
}

function setupRefreshOrderListForm() {
    console.log("setupRefreshForm...");
    document.querySelector("#refreshbutton input").addEventListener("click", function () {
        //  $("#refreshbutton input").on("click", function () {
        console.log("refresh orders by user = " + selectedUser);
        return false;
    });
}

function displayOrders(userid=false) {
    // Jquery
    getOrders().then((orders)=>{
        $('table.test').remove();
        var theadrow = $('<tr>').append('<td>Order Id</td>')
                                .append('<td>Size</td>')
                                .append('<td>Toppings</td>')
                                .append('<td>Status</td>');
        var thead = $('<thead />').append(theadrow)
        var tbody = $('<tbody />');
        orders.map(o=>{
            console.log(o,userid);
            if (o.user_id === userid) {
                var tbodyrow = $('<tr>').append('<td>' + o.id + '</td>')
                                        .append('<td>' + o.size + '</td>')
                                        .append('<td>' + o.toppings + '</td>')
                                        .append('<td>' + o.status + '</td>');
                tbody.append(tbodyrow);
            }
        })
        $('<table class="test" />').append(thead).append(tbody).appendTo('.tabContent.home');
    })
    
}

// Let user click on one of two tabs, show its related contents
// Contents for both tabs are in the HTML after initial setup,
// but one part is not displayed because of display:none in its CSS
// This implementation works for multiple two-tab setups because
// it works from the clicked-on element and finds the related
// content nearby. The related content needs to be a sibling of
// the clicked-on element's grandparent.
function setupTabs() {
    // Jquery
    $('.tabs a span').on('click',function (e) {
        e.preventDefault();
        $('.tabContent.active,.tabs a span').removeClass('active');
        $(e.target).addClass('active');
        $('.tabContent.' + $(e.target).data('type')).addClass('active');
    });
}

function displaySizesToppingsOnOrderForm() {
    console.log("displaySizesToppingsOnOrderForm");
    // find the element with id order-sizes, and loop through sizes,
    // setting up <input> elements for radio buttons for each size
    // and labels for them too
    // Then find the spot for meat toppings, and meatless ones
    // and for each create an <input> element for a checkbox
    // and a <label> for each
    // var label = document.getElementById("order-sizes");
    for (var i = 0; i < sizes.length; i++) {
        var size = document.getElementById("order-sizes");
        var radio = document.createElement("input");
        var x = sizes[i].size;
        radio.type = "radio";
        radio.name ='size';
        radio.value = x;
        size.appendChild(radio);
        size.appendChild(document.createTextNode(x + '\u00A0\u00A0\u00A0'));    
    }

    for (let i = toppings.length - 1; i >= 0; i--) {
        var topp_withmeat = document.getElementById("meats");
        var checkbox = document.createElement("input");
        var type = toppings[i].is_meat;
        if (type == 1) {
            var topping_meat = toppings[i].topping;
            checkbox.type = "checkbox";
            checkbox.name ='order_topping';
            checkbox.value = topping_meat;
            topp_withmeat.appendChild(checkbox);
            topp_withmeat.appendChild(document.createTextNode(topping_meat + '\u00A0\u00A0\u00A0'));
            // topp.content.innerHTML += "<li>" + x + "</li>";
        }     
    }

    for (let i = toppings.length - 1; i >= 0; i--) {
        var topp_withoutmeat = document.getElementById("meatlesses");
        var checkbox = document.createElement("input");
        var type = toppings[i].is_meat;
        if (type == 0) {
            var topping_meatless = toppings[i].topping;
            checkbox.type = "checkbox";
            checkbox.name ='order_topping';
            checkbox.value = topping_meatless;
            topp_withoutmeat.appendChild(checkbox);
            topp_withoutmeat.appendChild(document.createTextNode(topping_meatless + '\u00A0\u00A0\u00A0'));
            // topp.content.innerHTML += "<li>" + x + "</li>";
        }     
    }

    document.getElementById("meats").classList.remove("active");
    document.getElementById("meatlesses").classList.remove("active");

    document.querySelectorAll(".topping-tabs.meat-meatless a .active").forEach(function (element) {
    // Code for page 139-140, to finish Chap. 4 Amazeriffic:
        element.addEventListener("click", function () {
            event.preventDefault();
            document.querySelectorAll(".topping-tabs.meat-meatless a .active").forEach(function (element) {
                element.classList.remove("active");
            });
            // element.classList.add("active");
            // document.querySelector("#meats").innerHTML = "";
            // console.log("TAB clicked: " + element.innerHTML);
            // let content;
            if (element.parentElement.matches(":nth-child(1)")) {
                document.getElementById("meats").classList.add("active");
                document.getElementById("meatlesses").classList.remove("active");
            } else
            if (element.parentElement.matches(":nth-child(2)")) {
                document.getElementById("meats").classList.remove("active");
                document.getElementById("meatlesses").classList.add("active"); 
            }
            // document.querySelector("#meats").append(content);
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

    let orderButton = document.querySelector(".submitbutton").addEventListener("click", function(event) {
        var chosen_size = document.querySelector('input[name="size"]:checked').value;
        console.log(chosen_size);
        var chosen_toppings = document.querySelectorAll('input[name="order_topping"]:checked').value;
        console.log(chosen_toppings);
        var currentUser = document.getElementById("username-fillin2").innerHTML;
        console.log(currentUser);
        var userorder = {};
        userorder.user_id = currentUser;
        userorder.size = chosen_size;
        userorder.day = "1";
        userorder.status = "Preparing";
        // userorder.toppings = ["toppings_chosen"];
        postOrder(userorder);
    });
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
                console.log(toppings);
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
   let promise = new Promise((resolve,reject)=>{
        fetch(baseUrl + "/orders")
            .then(response => resolve(response.json()))
            .catch((e)=>reject(e))
    });
   console.log(promise);
    return promise;
}

    // return [{
    //         "id":5,
    //         "toppings": ['vegan cheese','mushrooms'],
    //         "size": "XXXXL",
    //         "status": "Prepaired"
    //     },{
    //         "orderId":6,
    //         "toppings": ['ananas','banana'],
    //         "size": "s",
    //         "status": "Wait to be acceted"
    //     },{
    //         "orderId":7,
    //         "toppings": ['chilli','zuccini'],
    //         "size": "M",
    //         "status": "Out for delivery"
    //     },{
    //         "orderId":2,
    //         "toppings": ['seewead','eggplant'],
    //         "size": "XL",
    //         "status": "Delivered"
    //     }]
// }
function updateOrder(order) {

}

function postOrder(order) {

    let promise = fetch(
            baseUrl + "/orders",
            {method: 'post',
            headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(order)
   })
            .then(response => response.json())
            // .then(json => {
            //     console.log("back from fetch: %O", json);
                
            // }
            .catch(error => console.error('error in getUsers:', error));
    return promise;
}

    // return $.ajax({
    //     url: baseUrl + "/orders",
    //     type: "POST",
    //     dataType: "json",
    //     //  headers: {"Content-type":"application/json"}, // needed
    //     success: function (result) {
    //         console.log("We did POST to /orders");
    //         console.log(result);
    //         orders = result;
    //     }
    // });
// }

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