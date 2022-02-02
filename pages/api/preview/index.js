import path from 'path'
import { apiQuery } from '/lib/api/'
import { GetEventBySlug } from '/graphql'

export default async function preview(req, res) {
  if (req.query.secret !== process.env.DATOCMS_PREVIEW_SECRET || !req.query.slug)
    return res.status(401).send('Invalid token')
  
  const query = req.query.slug

  try {
    const isExit = req.url.toLowerCase().startsWith('/api/preview/exit')
    const slug = path.basename(query)
    const { event } = await apiQuery(GetEventBySlug, {slug}, false)
    
    if (!event)
      return res.status(401).json({ message: 'Invalid slug' })
    
    if(!isExit)
      res.clearPreviewData()
    else
      res.setPreviewData({}, {maxAge: 10})
 
    res.writeHead(307, { Location: `/${event.participant.slug}/${event.slug}` })
    res.end()
  }catch(err){
    return res.status(401).send('Error previewing page!')
  }
}