// Use Javascript to let user click on a tab, show its contents
// Contents for both tabs are in the HTML, but part is not displayed
// because of display:none in its CSS
// Note that with recently-standardized CSS, you can do tabs
// without JS: see https://kyusuf.com/post/completely-css-tabs/
// This uses Flexbox, only recently available natively across
// modern browsers. See https://caniuse.com/#feat=flexbox
console.log("starting script");
element = document.querySelectorAll(".tabs a span").forEach(function (element) {
    element.addEventListener("click", function () {
        event.preventDefault();  // prevent any GET action for link
        // first clear out all class=active CSS settings on spans in tabs
        document.querySelectorAll(".tabs span").forEach(function (elt) {
            elt.classList.remove("active");
            console.log("removed active from element %O ", elt);
        });
        // then set class=active on selected element (changes background color)
        element.classList.add("active");
        console.log("TAB clicked: " + element.innerHTML);
         // Similarly, clear out all class=active CSS settings on content divs
        document.querySelectorAll(".content").forEach(function (elt) {
            elt.classList.remove("active");
            console.log("removed active from element %O ", elt);
        });
        // Set class=active on the appropriate content div to make it show up
        // e.g., if element is <span> of first <a> in tabs, make first content div active
        // element's parent is an <a>, one of two sibling elements 
        childno = element.parentNode.previousElementSibling === null ? 0 : 1;
        console.log("childno = " + childno);
        // find the <div> containing the two content <div>s
        contentArea = document.querySelector(".content").parentElement;
        console.log("contentArea= %O", contentArea);
        content = contentArea.children[childno];
        content.classList.add("active");
    });
});


