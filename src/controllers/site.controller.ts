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

import {Request, Response} from 'express';
import {
    failureResponse,
    mongoError,
    successResponse,
    unauthorised
} from '../modules/common/service';
import {IUser} from '../modules/users/model';
import {EncryptUtils} from "../utils/encrypt.utils";

import Logger from "../middleware/logger";

import UserService from '../modules/users/service';

import {AuthenticationHandler} from "../middleware/authentication.handler";
import {JwtJson, SubscribingUser} from "../common/types";
import {FileUtils} from "../utils/file.utils";

const getRandomQuote = require('random-quote-generator5.0');
const {JSDOM} = require("jsdom");
const {window} = new JSDOM("");
const jQuery = require("jquery")(window);

export class SiteController {

    private user_service: UserService = new UserService();

    private getHealth() {
        var statusArray = ['Up', 'Offline', 'Going Down', "In Maintenance"];    
        return statusArray[Math.floor(Math.random() * statusArray.length)];

    }

    public site_status(req: Request, res: Response) {
        let retObj = jQuery.parseJSON(`
        {
            "health": "${this.getHealth()}",
            "motd": "${getRandomQuote()}"
        }
        `);
        successResponse('Successfully retrieved site status', retObj, res);
    }

    public login_user(req: Request, res: Response) {
        Logger.debug(`Logging in user with with request body: ${JSON.stringify(req.body)}`);
        const hashPassword = EncryptUtils.cryptPassword(req.body.password);
        Logger.debug(`Hashed password for user ${req.body.email} is: ${hashPassword}`);
        const user_filter = {email: req.body.email, password: hashPassword};
        this.user_service.filterUser(user_filter, (err: any, user_data: IUser) => {
            if (err) {
                mongoError(err, res);
            } else {
                if (user_data) {
                    const jwtJson: JwtJson = AuthenticationHandler.createJWT(user_data);
                    // set cookie for refreshToken
                    res.cookie('refreshToken', jwtJson.refreshToken,
                        {httpOnly: true, sameSite: 'strict'}
                    );
                    successResponse('Successfully logged in user', jwtJson, res);
                } else {
                    unauthorised('Invalid credentials', res);
                }
            }
        });
    }

    public subscribe_user(req: Request, res: Response) {
        Logger.debug(`Subscribing user with details: ${JSON.stringify(req.body)}`);
        let userObj = <SubscribingUser>{};

        if (req.body.email !== null) {
            userObj = jQuery.parseJSON(`
                {
                    "firstName": "${req.body.firstName}",
                    "lastname": "${req.body.lastName}",
                    "email": "${req.body.email}",
                    "role": "user" 
                }
            `);
        }

        try {
            FileUtils.updateNewsletterDb(userObj);
        } catch (err) {
            failureResponse(`Error updating newsletter database: ${err}`, null, res);
        }

        successResponse('Successfully updated newsletter database', userObj, res);
    }

    public backup_newsletter_db(req: Request, res: Response) {
        let params = JSON.stringify(req.query)
        Logger.debug(`Backing up newsletter database with details: ${params}`);
        try {
            FileUtils.backupNewsletterDb(<String>req.query.filePath)
        } catch (err) {
            failureResponse(`Error backing up newsletter database: ${err}`, null, res);
        }

        let retObj = jQuery.parseJSON(`
        {
            "input": "${FileUtils.newsletterFile}",
            "output": "${req.query.filePath}"
        }
        `);
        successResponse('Successfully backed up newsletter database', retObj, res);
    }

}
