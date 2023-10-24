import * as mongoose from "mongoose";

const DATABASE_URL: string = "mongodb://equipe09:equipe09@ds133136.mlab.com:33136/projet2-09";

export class DBwrapper {

    public connect(): void {
        mongoose.connect(DATABASE_URL).catch((err: string) => {
            console.error(err);
        });
    }
}
