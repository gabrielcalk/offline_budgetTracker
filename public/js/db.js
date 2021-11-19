let db;

// variables that contains the name of the db and the store
const dbName = 'BudgetDB',
        storeName = 'BudgetStore'

// openning database
const request = window.indexedDB.open(dbName, 1);


request.onsuccess = function (event) {
    db = event.target.result;
// Checking if the navigator is online after the db has been created
    if (navigator.onLine) {
        console.log('Backend online! 🗄️');
        syncIndexdb();
    }
};

request.onerror = (event) =>{
    console.log(event)
}

// Creating store and index
request.onupgradeneeded = function (event) {
    db = event.target.result;

    let objectStore = db.createObjectStore(storeName, 
    {
        keyPath: 'id',
        autoIncrement: true
    })

    objectStore.createIndex('transaction', 'transaction', {unique: false})
};


const saveRecord = (record) => {
    // Saving the record when the navigator is offline
    const transactionAdd = db.transaction([storeName], 'readwrite')
    const objectStore = transactionAdd.objectStore(storeName)

    objectStore.add(record)
  
    transactionAdd.oncomplete = (event) =>{
        console.log('Transaction Completed', event);
    }
    transactionAdd.onerror = (event) =>{
        console.log('Transaction Error', event);
    }
};

// sync the indexDB with the mongoDB
const syncIndexdb = () =>{
    let transactionGet = db.transaction([storeName], 'readwrite');
    const objectStore = transactionGet.objectStore(storeName);
    const getAll = objectStore.getAll();

// after get all the data on indexdb, then post it using the router /api/transaction/bulk
    getAll.onsuccess = function (){
        if (getAll.result.length > 0){
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                  Accept: 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
                },
            })
            .then(data => data.json())
            .then(res => {
            transactionGet = db.transaction([storeName], 'readwrite');
            const currentStore = transactionGet.objectStore(storeName);
            currentStore.clear();
            console.log('Clearing store 🧹');
            })
        }
    }
};

window.addEventListener('online', syncIndexdb);
