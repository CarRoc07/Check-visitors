import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: 'https://us1-clever-sole-39812.upstash.io',
  token: process.env.REDIS_KEY!,
})