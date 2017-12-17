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

    private static readonly PastClass = 'fc-past';
    private static readonly TodayClass = 'fc-today';
    private static readonly FutureClass = 'fc-future';
    private static readonly ClassHilightDay1 = 'alert';
    private static readonly ClassHilightDay2 = 'alert-info';

    @ViewChild('rootElement')
    private rootElement: ElementRef;

    private apiServiceLoading: boolean;

    private firstLaunched: boolean;

    public apiresponseReceived: boolean;

    public currentDayDelta: number;

    public viewDate: Date;
    public locale: string;
    public displayedEvents: EventData[];

    public constructor(private httpClient: HttpClient) {
        this.apiServiceLoading = false;
        this.currentDayDelta = 0;
        this.apiresponseReceived = false;
        this.firstLaunched = true;
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
                .removeClass(UserPlanningComponent.PastClass)
                .removeClass(UserPlanningComponent.TodayClass)
                .removeClass(UserPlanningComponent.FutureClass);

            $(this)
                .addClass(
                    (Number(now.getDate()) > Number(newDayLabelSplitted[1])) ?  UserPlanningComponent.PastClass :
                    (Number(now.getDate()) === Number(newDayLabelSplitted[1])) ?  UserPlanningComponent.TodayClass :
                        UserPlanningComponent.FutureClass // (Number(now.getDate()) < Number(newDayLabelSplitted[1]))
                );

        });


        return $header;
    }

    private handleEventsResponse (events: Array<any>, beginDate: Date) {
        const now = new Date();
        const $mainContainer = $('.main-container');
        const oldScrollTop = $mainContainer.scrollTop();

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

        const firstDayCalendar = (this.currentDayDelta === 0) ?
            1 :
            (1 + (this.currentDayDelta % 7));

        beginDate.setHours(1)
        console.log (beginDate)
        console.log (beginDate.toISOString())

        // $ doesn't have fullCalendar method
        $plainningFcContainer
            .fullCalendar('destroy')
            .fullCalendar({
                header: false,
                footer: false,
                firstDay: (firstDayCalendar < 0) ? (firstDayCalendar + 7) : firstDayCalendar,
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

                    // color right current day
                    $calendar.el.find('.fc-bg td.fc-day').each(function () {

                        // remove all classes
                        $(this)
                            .removeClass(UserPlanningComponent.ClassHilightDay1)
                            .removeClass(UserPlanningComponent.ClassHilightDay2);

                        const dateCurrentTd = new Date($(this).data('date'));

                        if (dateCurrentTd.getDate() === now.getDate() &&
                            dateCurrentTd.getMonth() === now.getMonth() &&
                            dateCurrentTd.getFullYear() === now.getFullYear()) {
                            $(this).addClass(UserPlanningComponent.ClassHilightDay1)
                                   .addClass(UserPlanningComponent.ClassHilightDay2);
                        }
                    });

                    if (this.firstLaunched) {
                        this.firstLaunched = false;
                        const maxScrollTop = $mainContainer.prop('scrollHeight') - $mainContainer.outerHeight();
                        $mainContainer.scrollTop((now.getHours() * maxScrollTop) / 23);
                    }
                    else {
                        $mainContainer.scrollTop(oldScrollTop);
                    }
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
     * @param {0|-1|1} dayDelta
     */
    public setPlanning(dayDelta: 0|-1|1) {
        if (!this.apiServiceLoading) {
            this.currentDayDelta = (dayDelta === 0) ? 0 : (this.currentDayDelta + dayDelta);

            const now = new Date();
            const nbMilliSecondsInDay = 60 * 60 * 24 * 1000;

            const firstDisplayedDay = new Date(
                UserPlanningComponent.GetMonday(now).getTime() +
                this.currentDayDelta * nbMilliSecondsInDay);
            firstDisplayedDay.setHours(0);
            firstDisplayedDay.setMinutes(0);

            // we add 6 days to the monday to get sunday.
            const lastDisplayedDay = new Date(firstDisplayedDay.getTime() + 6 * nbMilliSecondsInDay);
            lastDisplayedDay.setHours(23)
            lastDisplayedDay.setMinutes(59)

            this.callEventsService(firstDisplayedDay, lastDisplayedDay);
        }
    }

    public ngOnInit(): void {
        this.locale = 'fr';
        this.viewDate = new Date();
        this.displayedEvents = [];

        this.setPlanning(0);
    }
}
