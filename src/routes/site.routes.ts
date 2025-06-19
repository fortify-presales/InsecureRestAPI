/*
        InsecureRestAPI - an insecure NodeJS/Expres/MongoDB REST API for educational purposes.

        Copyright (C) 2024-2025  Kevin A. Lee (kadraman)

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

import {SiteController} from "../controllers/site.controller";
import {AuthorizationHandler} from "../middleware/authorization.handler";

const site_controller: SiteController = new SiteController();

export const siteRoutes = Router();

siteRoutes.get('/api/v1/site/status', [AuthorizationHandler.permitAll], (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Site']
        #swagger.summary = "Get the site status"
        #swagger.description = "Get the site message of the day"
        #swagger.operationId = "getSiteStatus"
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

    site_controller.site_status(req, res);
});

siteRoutes.post('/api/v1/site/subscribe-user', [AuthorizationHandler.permitAll], (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Site']
        #swagger.summary = "Subscribe a new user"
        #swagger.description = "Subscribe a new user to the newsletter"
        #swagger.operationId = "subscribeUser"
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/subscribeUser"
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
           #swagger.responses[409] = {
               description: "User Already Exists",
               schema: { $ref: '#/components/schemas/failure' }
           }
        #swagger.responses[500] = {
            description: "Internal Server Error",
            schema: { $ref: '#/components/schemas/failure' }
        }
    */

    site_controller.subscribe_user(req, res);
});

siteRoutes.post('/api/v1/site/backup-newsletter-db', [AuthorizationHandler.permitAll], (req: Request, res: Response) => {

    /*
        #swagger.tags = ['Site']
        #swagger.summary = "Backup the newsletter database"
        #swagger.description = "Compress and backup the newsletter database to the specified file"
        #swagger.operationId = "backupNewsletterDb"
        #swagger.parameters['file_path'] = {
            in: 'query',
            description: 'The file to backup the database to. Cannot be empty.',
            type: 'string'
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

    site_controller.backup_newsletter_db(req, res);
});

/*siteRoutes.post('/api/site/upload-image', function(request, response) {
    fs.writeFileSync(`/tmp/upload/${request.body.name}`);

    // convert the image to correct size and format
    convert({
        file: `/tmp/upload/${request.body.name}`,
        width: 600,
        height: 400,
        type: 'jpeg'
    }).then(response => {
        // Command injection example
        exec('rm /tmp/upload/${request.body.name}');
        return response.sendStatus(200);
    }).catch(error => {
        return response.sendStatus(500);
    })

});*/
