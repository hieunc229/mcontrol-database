
import DatabaseManager from "../DatabaseManager";
const databaseManager = new DatabaseManager({
    location: process.env.STORAGE_DIR as string
});

export default databaseManager;