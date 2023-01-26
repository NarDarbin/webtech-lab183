const sqlite3 = require('sqlite3').verbose();

class Database{
    async open(mode){
        return new sqlite3.Database(':memory', mode);
    }

    async close(db){
        db.close();
    }

    async execute(statement, params, permissions){
        let mode = sqlite3.OPEN_READONLY;

        if(permissions === 'c'){
            mode = sqlite3.OPEN_CREATE;
        } else if(permissions === 'rw'){
            mode = sqlite3.OPEN_READWRITE;
        }

        const db = await this.open(mode);

        const result = await db.each(statement, params);

        this.close(db);

        return {success: true, content: {result}, message: ''};
    }
}

export {Database};