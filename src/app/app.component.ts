import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Fantasy Football Rankings';

  constructor() {
  }

  ngOnInit() {
    var config = {
    apiKey: "AIzaSyCEJJEi-oWyh6oCFfaX8Xn1yXJHYsFpM_U",
    authDomain: "fantasyfootballtest-ffdc0.firebaseapp.com",
    databaseURL: "https://fantasyfootballtest-ffdc0.firebaseio.com",
    projectId: "fantasyfootballtest-ffdc0",
    storageBucket: "fantasyfootballtest-ffdc0.appspot.com",
    messagingSenderId: "54123243240"
    };
    firebase.initializeApp(config);
    // const firestore = firebase.firestore();
    // const settings = {/* your settings... */ timestampsInSnapshots: true};
    // firestore.settings(settings);
    firebase.firestore().settings({ timestampsInSnapshots: true });
  }
}
