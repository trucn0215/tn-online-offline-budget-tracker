let db;
// Request to open a database instance
const request = indexedDB.open("budget", 1);

// Create schema on Dev tool
request.onupgradeneeded = function(event) {
    const db = event.target.result;

    // Create object called pending and autoIncrement = true
    const budgesPending = db.createObjectStore("pending", {
        autoIncrement: "true"
    });

    budgesPending.createIndex("statusIndex", "status");
}

// On success console the result
request.onsuccess = event => {
    // console.log(event.request.result);
    db = event.request.result;

    if(navigator.onLine){
        checkDatabase()
    }
}

function checkDatabase() {

}

// listen for app coming back online
window.addEventListener("online", checkDatabase);