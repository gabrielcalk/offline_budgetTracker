let outdb;
let db;

const dbName = 'BudgetDB',
        storeName = 'BudgetStore'

const request = window.indexedDB.open(dbName, 1);

request.onsuccess = function (event) {
    console.log(event, db)
};

request.onerror = (event) =>{
    console.log(event)
}

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
