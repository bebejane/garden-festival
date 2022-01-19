import ical from 'ical-generator';
import { apiQuery } from '/lib/api';
import { GetEvents } from '/graphql';

export default async function celendar(req, res) {
  
  const {events} = await apiQuery(GetEvents, {});
  const cal = ical({name: 'Community Garden Festival'});
  
  events.forEach( event => {
    cal.createEvent({
      start: new Date(event.startTime),
      end: new Date(event.endTime),
      summary: event.title,
      description: event.summary,
      location: 'Online',
      url: `https://communitygardenfestival.comm/${event.participant.slug}/${event.slug}`
    });
  })

  res.setHeader('Content-Type', 'text/calendar')
  res.setHeader('Content-Disposition', `attachment; filename="GardenFestivalFeb-7th-12th.ics"`)
  res.send(cal.toString())
}