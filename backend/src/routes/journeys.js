import { Router } from 'express'
import { z } from 'zod'
import { supabase } from '../config/supabase.js'
import { validate } from '../middleware/validate.js'

const router = Router()
const searchSchema = z.object({
  pickup: z.string().trim().min(2).max(160),
  destination: z.string().trim().min(2).max(160),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  passengers: z.coerce.number().int().min(1).max(4),
  journeyType: z.enum(['now', 'scheduled', 'commute'])
}).refine(v => v.pickup.toLowerCase() !== v.destination.toLowerCase(), {
  message: 'Pickup and destination must be different.'
})

router.post('/search', validate(searchSchema), async (req, res, next) => {
  try {
    const journey = req.validatedBody

    // This endpoint deliberately does not invent matches. It records no personal
    // data until authentication and a consent-based journey publishing flow exist.
    // Add route matching here after geocoding and overlap rules are implemented.
    if (!supabase) {
      return res.status(503).json({
        message: 'Search API is running, but Supabase is not configured yet. Add backend environment settings.'
      })
    }

    return res.status(200).json({
      status: 'received',
      message: 'Your journey details passed validation. Live matching will be enabled after account sign-in and journey publishing are configured.',
      search: {
        pickup: journey.pickup,
        destination: journey.destination,
        date: journey.date,
        time: journey.time,
        passengers: journey.passengers,
        journeyType: journey.journeyType
      },
      matches: []
    })
  } catch (error) {
    next(error)
  }
})

export default router
