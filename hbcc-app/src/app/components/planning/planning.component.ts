import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EventData} from '@app/model/event-data.model';

@Component({
  selector: 'hbcc-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {

    @ViewChild('rootElement')
    private rootElement: ElementRef;

    public viewDate: Date;
    public locale: string;
    public displayedEvents: EventData[];

    public constructor(private httpClient: HttpClient) { }

    private customizeJQueryHeader ($header: any) {
        $header.find('th.fc-day-header').each(function() {

            const newDayLabelSplitted = $(this)
                .text()
                .replace(/([a-zA-Z]+)\. ([0-9]{1,2}).*/, '$1|$2')
                .split('|');
            $(this).html(`
                <p>
                    ${newDayLabelSplitted[0].charAt(0).toUpperCase()}${newDayLabelSplitted[0].slice(1)}
                </p>
                &nbsp;
                <p>${newDayLabelSplitted[1]}</p>
            `);
        });
        return $header;
    }

    public ngOnInit(): void {
        this.locale = 'fr';
        this.viewDate = new Date();
        this.displayedEvents = [];
        this.httpClient.get('/api/events').subscribe((events: Array<any>) => {
            this.displayedEvents = [];
            for (const eventObj of events) {
                this.displayedEvents.push({
                    start: new Date (eventObj.start),
                    end: new Date (eventObj.end),
                    title: eventObj.description
                });
            }

            const localDisplayedEvents = this.displayedEvents;

            // delete old header
            jQuery(this.rootElement.nativeElement)
                .find('.planning-container > .planning-header')
                .remove();

            // $ doesn't have fullCalendar method
            jQuery(this.rootElement.nativeElement)
                .find('.planning-container')
                .fullCalendar('destroy')
                .fullCalendar({
                    header: false,
                    footer: false,
                    firstDay: 1,
                    defaultView: 'agendaWeek',
                    locale: 'fr',
                    allDaySlot: false,
                    slotDuration: '00:30:00',
                    slotLabelFormat: 'H:mm',
                    events: localDisplayedEvents,
                    themeSystem: 'bootstrap3',
                    dragScroll: false,
                    eventClick: () => {

                    },
                    eventAfterAllRender: ($calendar) => {
                        const $header = $calendar.el
                            .find('.fc-head > tr > .fc-head-container > div')
                            .detach()
                            .addClass('planning-header');

                        $(this.rootElement.nativeElement)
                            .find('.planning-container')
                            .prepend(this.customizeJQueryHeader($header));

                        // remove fullCalendar header container.
                        $calendar.el
                            .find('.fc-head')
                            .remove();


                        // scroll to the current hour
                        const now = new Date();
                        const $mainContainer = $('.main-container');
                        const maxScrollTop = $mainContainer.prop('scrollHeight') - $mainContainer.outerHeight();
                        $mainContainer.scrollTop((now.getHours() * maxScrollTop) / 23);
                    }
                });
        });
    }
}
