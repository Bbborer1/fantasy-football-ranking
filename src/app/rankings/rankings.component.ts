import { Component, OnInit } from '@angular/core';
import {Team, Matchup} from '../models';
import {isNullOrUndefined} from "util";
import { GameService } from './games.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as firebase from 'firebase';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.css'],
  providers: [GameService]
})
export class RankingsComponent implements OnInit {

  // a_team : Team = {owner:'Brett', name:'Brett'};
  // b_team : Team = {owner:'Andy', name:'Andy'};
  // c_team : Team = {owner:'Drew', name:'Drew'};
  // d_team : Team = {owner:'Keenan', name:'Keenan'};

  // matchup_1: Matchup = {homeTeam: this.a_team, homeTeamScore: 175, awayTeam: this.b_team, awayTeamScore: 172, week:1};
  // matchup_2: Matchup = {homeTeam: this.c_team, homeTeamScore: 96, awayTeam: this.d_team, awayTeamScore: 75, week: 1};
  // matchup_3: Matchup = {homeTeam: this.a_team, homeTeamScore: 180, awayTeam: this.d_team, awayTeamScore: 96, week: 2};
  // matchup_4: Matchup = {homeTeam: this.b_team, homeTeamScore: 99, awayTeam: this.c_team, awayTeamScore: 96, week: 2};

  // allGames = [this.matchup_1, this.matchup_2, this.matchup_3, this.matchup_4]
  
  // teams = [];
  gameList: Array<Matchup>;

  game: Matchup;
  
  db = firebase.firestore();

  teams = [];
  constructor(private GameService: GameService) { }

  ngOnInit() { 
    this.GameService.getGames();
    console.log(this.gameList);

    
        this.db.collection("games").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                updateTeamStats2(this.teams, doc.data().homeTeam, doc.data().homeTeamScore, doc.data().awayTeamScore);
                rank(this.teams, 'highScore', 'highScoreRank', 'asc');
            });
        });

  //   for(var game of this.gameList){
        
  //     updateTeamStats(this.teams, game.homeTeam, game.homeTeamScore, game.awayTeamScore, game.week, this.gameList);
  //     updateTeamStats(this.teams, game.awayTeam, game.awayTeamScore, game.homeTeamScore, game.week, this.gameList);
        
  //   }
    
  //   calculateRecordValues(this.teams);
  //   rank(this.teams, 'highScore', 'highScoreRank', 'asc')
  //   rank(this.teams, 'lowScore', 'lowScoreRank', 'desc')
  //   rank(this.teams, 'leagueRecordValue', 'leagueRecordRank', 'desc')
  //   rank(this.teams, 'recordValue', 'recordRank', 'desc')
  }
}

function rank(teams, rankingParam, outputParam, order){
  var orderedTeams = teams.sort(compareValues(rankingParam, order))
  var previousValue = 0;
  var previousRank = 0;
  var count = 0;
  var rank = 0;
  var value = 0;
    for (var i = 1; i <= orderedTeams.length; i++) {
      value = orderedTeams[i-1][rankingParam]
      if(value === previousValue){
        orderedTeams[i-1][outputParam] = previousRank;
      }
      else{
        count = countInArray(orderedTeams, rankingParam, value);
        rank = (2*i + count -1)/2;
        orderedTeams[i-1][outputParam] = rank;
        previousValue = value;
        previousRank = rank;
      }
      
    }
}

function countInArray(orderedTeams, param, value) {
  var count = 0;
  for (var i = 0; i < orderedTeams.length; i++) {
      if (orderedTeams[i][param] === value) {
          count++;
      }
  }
  return count;
}

function updateTeamStats2(teams, matchupTeam, teamScore, oppTeamScore){
  var team = teams.find( x => x.owner === matchupTeam.owner);
  if(isNullOrUndefined(team)){
    team = matchupTeam;
    teams.push(team);
  }
  team.mostRecentScore = teamScore;

  if(isNullOrUndefined(team.highScore) || team.highScore < teamScore){
    team.highScore = teamScore;
  }
  if(isNullOrUndefined(team.lowScore) || team.lowScore > teamScore){
    team.lowScore = teamScore;
  }

  if(isNullOrUndefined(team.losses)){
    team.losses = 0;
    team.ties = 0;
    team.wins = 0;
    team.leagueLosses = 0;
    team.leagueWins = 0;
    team.leagueTies = 0;
  }
  if(teamScore < oppTeamScore){
    team.losses = team.losses + 1;
  }
  if(teamScore > oppTeamScore){
    team.wins = team.wins + 1;
  }
  if(teamScore === oppTeamScore){
    team.ties = team.ties +1;
  }
}
  

function updateTeamStats(teams, matchupTeam, teamScore, oppTeamScore, week, games){
  var team = teams.find( x => x.owner === matchupTeam.owner);
  if(isNullOrUndefined(team)){
    team = matchupTeam;
    teams.push(team);
  }
  team.mostRecentScore = teamScore;

  if(isNullOrUndefined(team.highScore) || team.highScore < teamScore){
    team.highScore = teamScore;
  }
  if(isNullOrUndefined(team.lowScore) || team.lowScore > teamScore){
    team.lowScore = teamScore;
  }

  if(isNullOrUndefined(team.losses)){
    team.losses = 0;
    team.ties = 0;
    team.wins = 0;
    team.leagueLosses = 0;
    team.leagueWins = 0;
    team.leagueTies = 0;
  }
  if(teamScore < oppTeamScore){
    team.losses = team.losses + 1;
  }
  if(teamScore > oppTeamScore){
    team.wins = team.wins + 1;
  }
  if(teamScore === oppTeamScore){
    team.ties = team.ties +1;
  }

  for(var game of games){
    if (game.week === week){
      if (game.homeTeam.owner != team.owner){
        if(teamScore < game.homeTeamScore){
          team.leagueLosses = team.leagueLosses + 1;
        }
        if(teamScore > game.homeTeamScore){
          team.leagueWins = team.leagueWins + 1;
        }
        if(teamScore === game.homeTeamScore){
          team.leagueTies = team.leagueTies +1;
        }
      }
      if (game.awayTeam.owner != team.owner){
        if(teamScore < game.awayTeamScore){
          team.leagueLosses = team.leagueLosses + 1;
        }
        if(teamScore > game.awayTeamScore){
          team.leagueWins = team.leagueWins + 1;
        }
        if(teamScore === game.awayTeamScore){
          team.leagueTies = team.leagueTies +1;
        }
      }
    }
  }
}

function calculateRecordValues(teams){
  for(var team of teams){
    team.leagueRecordValue = 3 * team.leagueWins + team.leagueTies;
    team.recordValue = 3 * team.wins + team.ties;
  }

}

function compareValues(key, order) {
  return function(a, b) {
    if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
        return 0; 
    }

    const varA = (typeof a[key] === 'string') ? 
      a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string') ? 
      b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order == 'desc') ? (comparison * -1) : comparison
    );
  };
}