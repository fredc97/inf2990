export interface TrackResults {
    players: PlayerResults[];
    trackId: string;
}

export interface PlayerResults {
    playerName: string;
    time: Rounds;
}

interface Rounds {
    roundOne: Date;
    roundTwo: Date;
    roundThree: Date;
}
