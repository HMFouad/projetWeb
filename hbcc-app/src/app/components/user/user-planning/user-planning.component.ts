import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EventData} from 'app/model/event-data.model';
import {AppConstants} from '@app/app-constants';

@Component({
  selector: 'hbcc-user-planning',
  templateUrl: './user-planning.component.html',
  styleUrls: ['./user-planning.component.css']
})
export class UserPlanningComponent implements OnInit {

    @ViewChild('rootElement')
    private rootElement: ElementRef;

    private apiServiceLoading: boolean;

    public apiresponseReceived: boolean;

    public currentWeekDelta: number;

    public viewDate: Date;
    public locale: string;
    public displayedEvents: EventData[];

    public constructor(private httpClient: HttpClient) {
        this.apiServiceLoading = false;
        this.currentWeekDelta = 0;
        this.apiresponseReceived = false;
    }

    private static GetMonday(date: Date) {
        // index day in the week monday = 0, sunday = 6
        const day = (date.getDay() || 7);

        // nb days to step back to go to monday
        const diff = day - 1;

        return new Date(date.setDate(date.getDate() - diff));
    }

    private customizeJQueryHeader ($header: any) {
        const now = new Date();
        const currentWeekDay = (now.getDay() || 7) - 1;

        const pastClass = 'fc-past';
        const todayClass = 'fc-today';
        const futureClass = 'fc-future';

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


            // set right current date
            $(this)
                .removeClass(pastClass)
                .removeClass(todayClass)
                .removeClass(futureClass);

            /*$(this)
                .addClass(
                    (currentWeekDay ===)
                )*/

        });


        return $header;
    }

    private handleEventsResponse (events: Array<any>, beginDate: Date) {
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
            .find('.planning-container table.fc-header-table')
            .remove();

        const $plainningFcContainer = jQuery(this.rootElement.nativeElement)
            .children('.planning-container')
            .children('.plainning-fc');

        // $ doesn't have fullCalendar method
        $plainningFcContainer
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
                now: beginDate.toISOString(),
                themeSystem: 'bootstrap3',
                dragScroll: false,
                eventAfterAllRender: ($calendar) => {
                    const $header = $calendar.el
                        .find('.fc-head > tr > .fc-head-container > div')
                        .detach();

                    $(this.rootElement.nativeElement)
                        .find('.planning-container > .planning-header > .planning-header-fc-container')
                        .append(
                            this.customizeJQueryHeader($header.children('table'))
                                .addClass('fc-header-table')
                                .addClass('col-12')
                        );

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
    }

    private callEventsService(firstDisplayedDay: Date, lastDisplayedDay: Date): void {
        this.apiServiceLoading = true;
        this.httpClient.get('/api/events', {
            headers: {
                responseType: 'json',
                Authorization: `Bearer ${localStorage.getItem(AppConstants.AUTH_TOKEN_VALUE_NAME)}`
            },
            params: {
                beginDate: firstDisplayedDay.toISOString(),
                endDate: lastDisplayedDay.toISOString()
            }
        }).subscribe((events: Array<any>) => {
            this.apiServiceLoading = false;
            this.apiresponseReceived = true;
            this.handleEventsResponse(events, firstDisplayedDay);
        }, () => {
            this.apiServiceLoading = false;
            this.apiresponseReceived = false;
        });
    }

    /**
     * Change the current display week;
     * @param {number} weekDelta
     */
    public setWeek(weekDelta: number) {
        if (!this.apiServiceLoading) {
            this.currentWeekDelta = weekDelta;

            const now = new Date();
            const nbMilliSecondsInWeek = 60 * 60 * 24 * 7 * 1000;

            const dateAppliedDelta = now.getTime() + weekDelta * nbMilliSecondsInWeek;

            const firstDisplayedDay = UserPlanningComponent.GetMonday(new Date(dateAppliedDelta));

            // we add 6 days to the monday to get sunday.
            const lastDisplayedDay = new Date(firstDisplayedDay.getTime() + 6 * (60 * 60 * 24 * 1000));

            this.callEventsService(firstDisplayedDay, lastDisplayedDay);
        }
    }

    public ngOnInit(): void {
        this.locale = 'fr';
        this.viewDate = new Date();
        this.displayedEvents = [];

        this.setWeek(0);
    }
}
