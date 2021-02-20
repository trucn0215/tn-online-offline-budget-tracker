let db;
// Request to open a database instance
const request = indexedDB.open("budget", 1);

// Create schema on Dev tool
request.onupgradeneeded = function (event) {
    const db = event.target.result;

    // Create object called pending and autoIncrement = true
    const budgesPending = db.createObjectStore("pending", {
        autoIncrement: "true"
    });

    budgesPending.createIndex("statusIndex", "status");
}

request.onerror = function (event) {
    console.log("Woops! " + event.target.errorCode);
};

// On success console the result
request.onsuccess = event => {
    // console.log(event.request.result);
    db = event.request.result;

    if (navigator.onLine) {
        checkDatabase()
    }
}

function saveRecord(record) {
    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");

    // access your pending object store
    const store = transaction.objectStore("pending");

    // add record to your store with add method.
    store.add(record);
}

function checkDatabase() {
    // open a transaction on your pending db
    const transaction = db.transaction(["pending"], "readwrite");
    // access your pending object store
    const store = transaction.objectStore("pending");
    // get all records from store and set to a variable
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(() => {
                    // if successful, open a transaction on your pending db
                    const transaction = db.transaction(["pending"], "readwrite");

                    // access your pending object store
                    const store = transaction.objectStore("pending");

                    // clear all items in your store
                    store.clear();
                });
        }
    };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);