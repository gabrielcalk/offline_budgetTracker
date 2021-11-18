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
            const objectStoreTransaction = db.createObjectStore('transactions',
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

createDb()