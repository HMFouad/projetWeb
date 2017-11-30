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

  data:any = {};

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

   this.getData();
  }
 getData() {
    this.http.get('/api/events').subscribe(data => {
      this.data = data;
       console.log("Donnes");
       console.log(data.description);
       this.getWeekEvents();

    });
 }
 getWeekEvents() {
   this.lundi= {day:"27/11/2017", events:new Array()};
   this.mardi=  {day:"28/11/2017", events:new Array()};
   this.mercredi=  {day:"29/11/2017", events:new Array()};
   this.jeudi=  {day:"30/11/2017", events:new Array()};
   this.vendredi=  {day:"01/12/2017", events:new Array()};


   console.log(this.data.description);
   console.log(this.data.description.length);
   for (var i = 0; i < this.data.beginDate.length; i++) {
    //On crée un nouvel évènement
    var newEvent ={  description:this.data.description[i],
                beginDate:new Date(this.data.beginDate[i].jour),
                endDate:new Date(this.data.endDate[i].jour),
                location: this.data.location[i] };
     //On l'ajout dans la liste des évènements de la journée de la semaine qui lui correspond
     switch(this.data.beginDate.jour) {
        case this.lundi.day:
            this.lundi.events.push(newEvent);
            break;
        case this.mardi.day:
            this.mardi.events.push(newEvent);
            break;
        case this.mercredi.day:
            this.mercredi.events.push(newEvent);
            break;
        case this.jeudi.day:
            this.jeudi.events.push(newEvent);
            break;
        case this.vendredi.day:
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
