import express from 'express'
import Notification from '../models/notification.js'
import User from '../models/user.js'

const notificationsRouter = express.Router()

notificationsRouter.get('/', async (request, response) => {
    const notifications = await Notification
        .find({})
        .populate('user')
    
    response.json(notifications)
})

notificationsRouter.get('/:id', async (request, response) => {
    const notification = await Notification
        .findById(request.params.id)
        .populate('user')
        
    response.json(notification)
})

notificationsRouter.post('/', async (request, response) => {
    const { content, user } = request.body
    const notifUser = await User.findById(user)

    const notification = new Notification({
        content,
        user: notifUser
    })

    const savedNotification = await notification.save()
    notifUser.notifications = notifUser.notifications.concat(savedNotification._id)
    await notifUser.save()

    response
        .status(201)
        .json(savedNotification)
})

export default notificationsRouter