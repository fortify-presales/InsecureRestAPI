/*
        IWA-API - An insecure Node/Express REST API for use in Fortify demonstrations.

        Copyright 2024 Open Text or one of its affiliates.

        This program is free software: you can redistribute it and/or modify
        it under the terms of the GNU General Public License as published by
        the Free Software Foundation, either version 3 of the License, or
        (at your option) any later version.

        This program is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
        GNU General Public License for more details.

        You should have received a copy of the GNU General Public License
        along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import {Request, Response, Router} from 'express';

import {MessageController} from '../controllers/message.controller';
import {AuthorizationHandler} from "../middleware/authorization.handler";
import Logger from "../middleware/logger";
import {IMessage} from "../modules/messages/model";
import {mongoError, successResponse} from "../modules/common/service";
import {MessagePermission} from "../modules/messages/permissions"

const { requiredScopes } = require('express-oauth2-jwt-bearer');

import messages from '../modules/messages/schema';

const message_controller: MessageController = new MessageController();

export const messageRoutes = Router();

messageRoutes.param('id', function (req, res, next, id, name) {
    Logger.debug('Message id parameter is: ' + id); //specified _id_ value comes from URL
    next();
});

messageRoutes.get('/api/v1/messages', AuthorizationHandler.checkJWT, requiredScopes(MessagePermission.Read), (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Messages']
        #swagger.summary = "Find messages by keyword(s)"
        #swagger.description = "Gets all existing messages searching by %keyword% format"
        #swagger.parameters['keywords'] = {
            in: 'query',
            description: 'Keyword(s) search for messages to be found.',
            type: 'string'
        }
        #swagger.parameters['offset'] = {
            in: 'query',
            description: 'Offset of the starting record. 0 indicates the first record.',
            type: 'number'
        }
        #swagger.parameters['limit'] = {
            in: 'query',
            description: 'Maximum records to return. The maximum value allowed is 50.',
            type: 'number'
        }
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/components/schemas/success' }
        }
        #swagger.responses[400] = {
            description: "Bad Request",
            schema: { $ref: '#/components/schemas/failure' }
        }
        #swagger.responses[500] = {
            description: "Internal Server Error",
            schema: { $ref: '#/components/schemas/failure' }
        }
     */

    message_controller.get_messages(req, res);
});

messageRoutes.get('/api/v1/messages/:id', AuthorizationHandler.checkJWT, requiredScopes(MessagePermission.Read), (req: Request, res: Response) => {
    /*
       #swagger.tags = ['Messages']
       #swagger.summary = "Get a message"
       #swagger.description = "Gets an existing message"
       #swagger.parameters['id'] = {
           description: 'Id of the message to be retrieved. Cannot be empty.'
       }
       #swagger.responses[200] = {
           description: "Success",
           schema: { $ref: '#/components/schemas/success' }
       }
       #swagger.responses[400] = {
           description: "Bad Request",
           schema: { $ref: '#/components/schemas/failure' }
       }
       #swagger.responses[404] = {
           description: "Message Not Found",
           schema: { $ref: '#/components/schemas/failure' }
       }
       #swagger.responses[500] = {
           description: "Internal Server Error",
           schema: { $ref: '#/components/schemas/failure' }
       }
    */
    message_controller.get_message(req, res);
});

messageRoutes.get('/api/v1/message', AuthorizationHandler.checkJWT, requiredScopes(MessagePermission.Read), (req: Request, res: Response) => {
    /*
       #swagger.tags = ['Messages']
       #swagger.summary = "Get a message using query"
       #swagger.description = "Gets an existing message using a MongoDb Query"
       #swagger.parameters['q'] = {
           description: 'MongoDb query'
       }
       #swagger.responses[200] = {
           description: "Success",
           schema: { $ref: '#/components/schemas/success' }
       }
       #swagger.responses[400] = {
           description: "Bad Request",
           schema: { $ref: '#/components/schemas/failure' }
       }
       #swagger.responses[404] = {
           description: "Message Not Found",
           schema: { $ref: '#/components/schemas/failure' }
       }
       #swagger.responses[500] = {
           description: "Internal Server Error",
           schema: { $ref: '#/components/schemas/failure' }
       }
    */

    Logger.debug(`Retrieving message using query: ${JSON.stringify(req.query)}`);
    const messageQuery = req.query.q;
    messages.findOne({ messageQuery }, (err: any, message_data: IMessage) => {
        if (err) {
            mongoError(err, res);
        } else {
            successResponse('Successfully retrieved message', message_data, res);
        }
    });
});

messageRoutes.post('/api/v1/messages', AuthorizationHandler.checkJWT, requiredScopes(MessagePermission.Create), (req: Request, res: Response) => {
    /*
          #swagger.tags = ['Messages']
          #swagger.summary = "Create new message"
          #swagger.description = "Creates a new message"
          #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/message"
                      }
                  }
              }
          }
          #swagger.responses[200] = {
              description: "Success",
              schema: { $ref: '#/components/schemas/success' }
          }
          #swagger.responses[400] = {
              description: "Bad Request",
              schema: { $ref: '#/components/schemas/failure' }
          }
          #swagger.responses[500] = {
              description: "Internal Server Error",
              schema: { $ref: '#/components/schemas/failure' }
          }
      */
    message_controller.create_message(req, res);
});

messageRoutes.put('/api/v1/messages/:id', AuthorizationHandler.checkJWT, requiredScopes(MessagePermission.Update), (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Messages']
        #swagger.summary = "Update a message"
        #swagger.description = "Updates an existing message"
        #swagger.parameters['id'] = {
            description: 'Id of the message to be updated. Cannot be empty.'
        }
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/components/schemas/success' }
        }
        #swagger.responses[400] = {
            description: "Bad Request",
            schema: { $ref: '#/components/schemas/failure' }
        }
        #swagger.responses[404] = {
            description: "Message Not Found",
            schema: { $ref: '#/components/schemas/failure' }
        }
        #swagger.responses[500] = {
            description: "Internal Server Error",
            schema: { $ref: '#/components/schemas/failure' }
        }
     */
    message_controller.update_message(req, res);
});

messageRoutes.delete('/api/v1/messages/:id', AuthorizationHandler.checkJWT, requiredScopes(MessagePermission.Delete), (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Messages']
        #swagger.summary = "Delete a message"
        #swagger.description = "Deletes an existing message"
        #swagger.parameters['id'] = {
            description: 'Id of the message to be deleted. Cannot be empty.'
        }
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/components/schemas/success' }
        }
        #swagger.responses[400] = {
            description: "Bad Request",
            schema: { $ref: '#/components/schemas/failure' }
        }
        #swagger.responses[404] = {
            description: "Message Not Found",
            schema: { $ref: '#/components/schemas/failure' }
        }
        #swagger.responses[500] = {
            description: "Internal Server Error",
            schema: { $ref: '#/components/schemas/failure' }
        }
     */
    message_controller.delete_message(req, res);
});

