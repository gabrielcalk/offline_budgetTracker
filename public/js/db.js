let outdb;
let db;

// Managing IndexDB
const createDb = () =>{
    if(window.indexedDB){
        const request = window.indexedDB.open('budgetDB', 1);
        request.onsuccess = (event) =>{

        }

        request.onerror = (event) =>{
            console.log(event)
        }

        request.onupgradeneeded = (event) =>{
            db = event.target.result;
            const objectStoreTransaction = db.createObjectStore('BudgetStore',
                {
                    keyPath: 'id',
                    autoIncrement: true
                });
            objectStoreTransaction.createIndex('transaction', 'transaction', {unique: false});
        }
    }else{
        console.log('no support');
    }
};

const saveRecord = (record) => {
    console.log('Save record invoked');
    // Create a transaction on the BudgetStore db with readwrite access
    const transaction = db.transaction(['BudgetStore'], 'readwrite');
  
    // Access your BudgetStore object store
    const store = transaction.objectStore('BudgetStore');
  
    // Add record to your store with add method.
    store.add(record);
};

createDb()