export class Team {
    name: string;
    owner: string;
    highScore?: number;
    lowScore?: number;
    highScoreRank?: number;
    lowScoreRank?: number;
    wins?: number;
    losses?: number;
    ties?: number;
    leagueWins?: number;
    leagueLosses?: number;
    leagueTies?: number;
    mostRecentScore?: number;
    recordValue?:number;
    recordRank?: number;
    leagueRecordValue?: number;
    leagueRecordRank?: number;

    constructor(jsonData){
        this.name = jsonData.name;
        this.owner = jsonData.owner;
    }
}

export class Matchup{
    homeTeam: Team;
    homeTeamScore: number;
    awayTeam: Team;
    awayTeamScore: number;
    week: number;

    constructor(jsonData){
        this.homeTeam = new Team(jsonData.homeTeam);
        this.awayTeam = new Team(jsonData.awayTeam);
        this.awayTeamScore = jsonData.awayTeamScore;
        this.homeTeamScore = jsonData.homeTeamScore;
        this.week = jsonData.week;
    }
}