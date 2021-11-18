let outdb;
let db;

const dbName = 'BudgetDB',
        storeName = 'BudgetStore'

const request = window.indexedDB.open(dbName, 1);

request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
        console.log('Backend online! 🗄️');
        syncIndexdb();
    }
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

const syncIndexdb = () =>{
    let transactionGet = db.transaction([storeName], 'readwrite');
    const objectStore = transactionGet.objectStore(storeName);
    const getAll = objectStore.getAll();

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