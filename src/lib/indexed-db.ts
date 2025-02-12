import { Folder, Note } from "./types";

class Database {
  private static instance: Database;
  private db: IDBDatabase | null = null;
  private request: IDBOpenDBRequest;

  private constructor() {
    this.request = indexedDB.open("txy-notes", 1);

    this.request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      this.db = (event.target as IDBOpenDBRequest).result;

      if (this.db.objectStoreNames.contains("folder")) {
        this.db.deleteObjectStore("folder");
      }

      this.db.createObjectStore("folder", { keyPath: "folderId", autoIncrement: true });
    };

    this.request.onsuccess = (event: Event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
    };

    this.request.onerror = (event) => {
      console.error("Error opening database", event);
    };
  }

  public getAllFolders(): Promise<Folder[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = this.db.transaction("folder", "readonly");
      const store = transaction.objectStore("folder");
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error("Error fetching folders"));
      };
    });
  }

  public addFolder(folder: Folder): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = this.db.transaction("folder", "readwrite");
      const store = transaction.objectStore("folder");
      const request = store.add({id: folder.folderId, folder});

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error("Error adding folder"));
    });
  }

  public updateFolder(folder: Folder): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = this.db.transaction("folder", "readwrite");
      const store = transaction.objectStore("folder");
      const request = store.put({id: folder.folderId, folder});

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error("Error updating folder"));
    });
  }

  public deleteFolder(folderId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = this.db.transaction("folder", "readwrite");
      const store = transaction.objectStore("folder");
      const request = store.delete(folderId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error("Error deleting folder"));
    });
  }

  public addNoteInFolder(note: Note, folderId: string): void {
    if (!this.db) return;

    const transaction = this.db.transaction("folder", "readwrite");
    const store = transaction.objectStore("folder");

    const localRequest = store.get(folderId);

    localRequest.onsuccess = () => {
      const folder = localRequest.result;
      folder.notes.push(note);

      const updateRequest = store.put(folder);

      updateRequest.onsuccess = () => {
        console.log("Nota añadida correctamente");
      };

      updateRequest.onerror = () => {
        console.error("Error al añadir la nota");
      };
    };

    localRequest.onerror = () => {
      console.error("Error al obtener el folder");
    };
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

export default Database;