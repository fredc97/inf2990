import * as mongoose from "mongoose";

export const trackSchema: mongoose.Schema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    timesPlayed: { type: Number, required: true },
    points: { type: [{ x: Number, y: Number, z: Number }], required: true }
});
export default mongoose.model("track", trackSchema);
