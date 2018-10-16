var CalendarBackgroundEvents = {
	init: function () {
		var e = moment()
			.startOf("day"),
			t = e.format("YYYY-MM"),
			i = e.clone()
			.subtract(1, "day")
			.format("YYYY-MM-DD"),
			r = e.format("YYYY-MM-DD"),
			o = e.clone()
			.add(1, "day")
			.format("YYYY-MM-DD");
		$("#m_calendar")
			.fullCalendar({
				header: {
					left: "prev,next today",
					center: "title",
					right: "month,agendaWeek,agendaDay,listWeek"
				},
				editable: !0,
				eventLimit: !0,
				navLinks: !0,
				businessHours: !0,
				events: [
				{
		            title: "try",
		            description: "kedatangan tempat",
		            start: "2018-01-24"
		            
		        }
		        ],
				
				eventRender: function (e, t) {
					t.hasClass("fc-day-grid-event") ? (t.data("content", e.description), t.data("placement", "top"), mApp.initPopover(t)) : t.hasClass(
							"fc-time-grid-event") ? t.find(".fc-title")
						.append('<div class="fc-description">' + e.description + "</div>") : 0 !== t.find(".fc-list-item-title")
						.lenght && t.find(".fc-list-item-title")
						.append('<div class="fc-description">' + e.description + "</div>")
				}
			})
	}
};
jQuery(document)
	.ready(function () {
		CalendarBackgroundEvents.init()
	});