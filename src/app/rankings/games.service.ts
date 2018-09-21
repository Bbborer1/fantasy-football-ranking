
import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import { Observable, of } from 'rxjs';
import { Team, Matchup } from '../models';

@Injectable()
export class GameService {

    a_team : Team = {owner:'Brett', name:'Brett'};
    b_team : Team = {owner:'Andy', name:'Andy'};
    c_team : Team = {owner:'Drew', name:'Drew'};
    d_team : Team = {owner:'Keenan', name:'Keenan'};

    matchup_1: Matchup = {homeTeam: this.a_team, homeTeamScore: 175, awayTeam: this.b_team, awayTeamScore: 172, week:1};
    matchup_2: Matchup = {homeTeam: this.c_team, homeTeamScore: 96, awayTeam: this.d_team, awayTeamScore: 75, week: 1};
    matchup_3: Matchup = {homeTeam: this.a_team, homeTeamScore: 180, awayTeam: this.d_team, awayTeamScore: 96, week: 2};
    matchup_4: Matchup = {homeTeam: this.b_team, homeTeamScore: 99, awayTeam: this.c_team, awayTeamScore: 96, week: 2};

    allGames = [this.matchup_1, this.matchup_2, this.matchup_3, this.matchup_4]

    matchups = [];
    // gameList: Observable<Array<Matchup>>;

    constructor(){
    }


    getGames(): Array<Matchup> {
        var db = firebase.firestore();
        db.collection("games").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // console.log(`${doc.id} => ${doc.data()}`);
                var m = new Matchup(doc.data())
                this.matchups.push(m)
                console.log(this.matchups)
            });
        });
        console.log(this.matchups);
        return this.matchups
    }
} 