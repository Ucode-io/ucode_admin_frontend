import {openDB} from "idb";

const DB_NAME = "languages";
const STORE_NAME = "myStore";

const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {keyPath: "id", autoIncrement: true});
      }
    },
  });
};

export const saveGroupedToDB = async (groupedData) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  for (const [category, values] of Object.entries(groupedData)) {
    await store.put({key: category, values});
  }

  await tx.done;
  console.log("Grouped Data Saved:", groupedData);
};

export const getAllFromDB = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const clearDB = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.objectStore(STORE_NAME).clear();
  await tx.done;
  console.log("Database cleared.");
};
