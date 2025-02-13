import { Folder, Note } from "./types";

class Database {
  private static instance: Database;
  private db: IDBDatabase | null = null;
  private request: IDBOpenDBRequest;
  private dbReady: Promise<void>;

  private constructor() {
    this.request = indexedDB.open("txy-notes", 1);

    this.dbReady = new Promise((resolve, reject) => {
      this.request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        this.db = (event.target as IDBOpenDBRequest).result;

        if (this.db.objectStoreNames.contains("folder")) {
          this.db.deleteObjectStore("folder");
        }

        this.db.createObjectStore("folder", { keyPath: "folderId", autoIncrement: true });
      };

      this.request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      this.request.onerror = (event) => {
        console.error("Error opening database", event);
        reject(new Error("Failed to initialize database"));
      };
    });
  }

  public async waitForConnection(): Promise<void> {
    return this.dbReady;
  }

  public async getAllFolders(): Promise<Folder[]> {
    await this.waitForConnection();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = this.db.transaction("folder", "readonly");
      const store = transaction.objectStore("folder");
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(new Error("Error fetching folders"));
      };
    });
  }

  public async addFolder(folder: Folder): Promise<void> {
    await this.waitForConnection();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = this.db.transaction("folder", "readwrite");
      const store = transaction.objectStore("folder");
      const request = store.add({ id: folder.folderId, folder });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error("Error adding folder"));
    });
  }

  public async updateFolder(folder: Folder): Promise<void> {
    await this.waitForConnection();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = this.db.transaction("folder", "readwrite");
      const store = transaction.objectStore("folder");
      const request = store.put({ id: folder.folderId, folder });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error("Error updating folder"));
    });
  }

  public async deleteFolder(folderId: string): Promise<void> {
    await this.waitForConnection();

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

  public async addNoteInFolder(note: Note, folderId: string): Promise<void> {
    await this.waitForConnection();

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