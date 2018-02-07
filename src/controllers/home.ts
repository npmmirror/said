import { Request, Response } from 'express'

/**
 * GET /
 * Home page.
 */
export const index = (req: Request, res: Response) => {
  res.render('home', {
    title: '听说 - 秋天该很好，你若尚在场'
  })
}
