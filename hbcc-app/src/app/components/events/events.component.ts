import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router} from "@angular/router"


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
	calendar : any;

  lundi : {day:string,events:any[]};
  mardi : {day:string,events:any[]};
  mercredi : {day:string,events:any[]};
  jeudi : {day:string,events:any[]};
  vendredi : {day:string,events:any[]};

  data:any;
  description:string[];
  beginDate:string[];
  endDate:string[];
  location:string[];

  constructor(private http: HttpClient) { }

  ngOnInit() {
   this.getData();
  }
 getData() {
    this.http.get('/api/events').subscribe(data => {
    this.data = data;
    this.description = this.data.description;
    this.beginDate = this.data.beginDate;
    this.endDate = this.data.endDate;
    this.location = this.data.location;
    console.log("Descriptions des cours");
    console.log(this.description);
    console.log("Date de début des cours");
    console.log(this.beginDate);
    console.log("Date de fin des cours");
    console.log(this.endDate);
    console.log("Localisation des cours");
    console.log(this.location);
    this.getWeekEvents();

    });
 }
 getWeekEvents() {
   this.lundi= {day:"27/11/2017", events:new Array()};
   this.mardi=  {day:"28/11/2017", events:new Array()};
   this.mercredi=  {day:"29/11/2017", events:new Array()};
   this.jeudi=  {day:"30/11/2017", events:new Array()};
   this.vendredi=  {day:"01/12/2017", events:new Array()};


  // console.log(this.data.description);
  // console.log(this.data.description.length);
   for (var i = 0; i < this.description.length; i++) {
    //On crée un nouvel évènement
    //console.log("On crée un évènement");
    var beginDateSplited=this.beginDate[i].split(",");
    var endDateSplited=this.endDate[i].split(",");
    var newEvent ={   description:this.description[i],
                      beginDate:new Date(beginDateSplited[0]+"-"+beginDateSplited[1]+"-"+beginDateSplited[2]+"T"+beginDateSplited[3]+":"+beginDateSplited[4]+":00Z"),
                      endDate:  new Date(endDateSplited[0]+"-"+endDateSplited[1]+"-"+endDateSplited[2]+"T"+endDateSplited[3]+":"+endDateSplited[4]+":00Z"),
                      location: this.location[i] };
    //console.log(newEvent);
     //On l'ajout dans la liste des évènements de la journée de la semaine qui lui correspond
     console.log("On l'ajoute dans la liste des évènements du jour de la smeaine qui lui correspond s'il y en a un.");
     console.log(beginDateSplited[2]+"/"+beginDateSplited[1]+"/"+beginDateSplited[0]);
     console.log(new Date(beginDateSplited[0]+"-"+beginDateSplited[1]+"-"+beginDateSplited[2]+"T"+beginDateSplited[3]+":"+beginDateSplited[4]+":00Z"));
     var comp =beginDateSplited[2]+"/"+beginDateSplited[1]+"/"+beginDateSplited[0]
     switch(comp) {
        case this.lundi.day:
            console.log(this.lundi.day+"  -> Correspondance");
            this.lundi.events.push(newEvent);
            break;
        case this.mardi.day:
            console.log(this.mardi.day+"  -> Correspondance");
            this.mardi.events.push(newEvent);
            break;
        case this.mercredi.day:
            console.log(this.mercredi.day+"  -> Correspondance");
            this.mercredi.events.push(newEvent);
            break;
        case this.jeudi.day:
            console.log(this.jeudi.day+"  -> Correspondance");
            this.jeudi.events.push(newEvent);
            break;
        case this.vendredi.day:
            console.log(this.vendredi.day+"  -> Correspondance");
            this.vendredi.events.push(newEvent);
            break;
        default:
        }
   }

   //On redéfinit le calendrier avec les nouvelles listes d'évènements
   this.calendar = {		lundi:this.lundi.events,
              					mardi:this.mardi.events,
              					mercredi:this.mercredi.events,
              					jeudi:this.jeudi.events,
              					vendredi:this.vendredi.events };
  }


}
