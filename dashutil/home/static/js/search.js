function expand() {
    var searchBox = document.getElementById("search-box");
    var searchIcon = document.getElementById("search-icon");
    var inputText = document.getElementById("input-text");
    var searchButton = document.getElementById("search-button"); 
    var oldSearch = document.getElementById("old-search");

    if (searchBox.classList.contains("prev")) {
        searchBox.classList.remove("prev");
        searchIcon.classList.remove("prev");
        inputText.classList.remove("prev");
        searchButton.classList.remove("prev");
    }
    else if (!searchBox.classList.contains("expanded")) {
        console.log("Expand box");

        searchBox.classList.add("expanded");
        searchIcon.classList.add("expanded");
        inputText.classList.add("expanded");
        searchButton.classList.add("expanded"); 
        oldSearch.id = "new-search"; 
    }
}

function contract() {
    var searchBox = document.getElementById("search-box");
    var searchIcon = document.getElementById("search-icon");
    var inputText = document.getElementById("input-text");
    var searchButton = document.getElementById("search-button"); 
    var newSearch = document.getElementById("new-search");

    if (searchBox.classList.contains("expanded")) {
        console.log("Contract box");

        searchBox.classList.remove("expanded");
        searchIcon.classList.remove("expanded");
        inputText.classList.remove("expanded");
        searchButton.classList.remove("expanded"); 

        searchBox.classList.add("prev");
        searchIcon.classList.add("prev");
        inputText.classList.add("prev");
        searchButton.classList.add("prev"); 
        newSearch.id = "old-search"; 
    }
        
}