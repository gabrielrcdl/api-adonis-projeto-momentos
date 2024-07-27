import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import Moment from 'App/Models/Moment'

export default class CommentsController {
  public async store({ request, response, params }: HttpContextContract) {
    const xml = require('xml2js')

    const bestMatch = request.accepts(['json', xml])

    const body = request.body()
    const momentId = params.momentId

    await Moment.findOrFail(momentId)

    body.momentId = momentId

    const comment = await Comment.create(body)

    switch (bestMatch) {
      case 'json':
        return comment

      case xml:
        const builder = new xml.Builder({ rootName: 'response' })
        return builder.builderObjrct(comment)

      default:
        response.status(201)

        return {
          message: 'Comentário adicionado com sucesso!',
          data: comment,
        }
    }
  }
}
