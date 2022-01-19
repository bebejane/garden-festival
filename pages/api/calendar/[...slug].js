import ical from 'ical-generator';
import sanitizeFilename from 'sanitize-filename';
import { apiQuery } from '/lib/api';
import { GetEventBySlug } from '/graphql';

export default async function celendar(req, res) {
  
  const { slug } = req.query;
  const { event } = await apiQuery(GetEventBySlug, {slug:slug[0]});
  
  if(!event) return res.status(404).end()

  const cal = ical({name: 'Community Garden Festival'});

  cal.createEvent({
    start: new Date(event.startTime),
    end: event.endTime ? new Date(event.endTime): undefined,
    summary: event.title,
    description: event.summary,
    location: 'Online',
    url: `https://www.thecommunity.garden/${event.participant.slug}/${event.slug}`
  });

  res.setHeader('Content-Type', 'text/calendar')
  res.setHeader('Content-Disposition', `attachment; filename="Community Garden Festival - ${sanitizeFilename(event.title)}.ics"`)
  res.send(cal.toString())
}