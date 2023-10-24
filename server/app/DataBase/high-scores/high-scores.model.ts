import * as mongoose from "mongoose";

export const highScoresSchema: mongoose.Schema = new mongoose.Schema({
    name: { type: String, required: true },
    time: { type: Date, required: true },
    idTrack: { type: String, required: true }
});
export default mongoose.model("highScores", highScoresSchema);
