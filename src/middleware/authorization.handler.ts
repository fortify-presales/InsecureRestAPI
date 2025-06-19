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

import Logger from "./logger";
import config from "config";
import {NextFunction, Request, Response} from "express";
import {forbidden} from "../modules/common/service";

const { expressjwt: jwt } = require("express-jwt");
const { auth } = require('express-oauth2-jwt-bearer');

//const auth0Domain: string = config.get('App.auth0.domain');
//const auth0Audience: string = config.get('App.auth0.audience');
//const jwtSecret: string = config.get('App.jwtSecret') || "changeme";
//const jwtExpiration: number = config.get('App.jwtExpiration') || 36000;
//const jwtAudience: string = config.has("App.jwtAudience") ? config.get('App.jwtAudience') : "https://insecureapi.azurewebsites.net/api";

export class AuthorizationHandler {
   
    //public static checkJWT = auth({
    //    audience: auth0Audience,
    //    issuerBaseURL: auth0Domain
    //});

    //public static authRequiredPermissions = (permission: string | string[]) => {
    //    if (typeof permission === 'string') {
    //      permission = [permission]
    //    }
    //    return claimIncludes('permissions', ...permission)
    //}
      
    /*public static requirePermission(permissions: string | string[]) {
            const jwtAuth = jwtAuthz([permissions], {
                customScopeKey: "permissions",
                customUserKey: "auth",
                checkAllScopes: true,
                failWithError: false // should be true and catch with custom error handler
            });
            return jwtAuth;
    };*/

    /*public static requirePermission(role: string | undefined) {
        Logger.debug(`AuthorizationHandler::requirePermission`);
        return (req: Request, res: Response, next: NextFunction) => {
            Logger.debug(req);
            Logger.debug(`Checking if user has permission: ${role}`);
            guard.check(role)(req, res, (err: any) => {
                if (err) {
                    Logger.debug(`User does not have permission: ${role}`);
                    forbidden(`User does not have permission: ${role}`, res);
                } else {
                    Logger.debug(`User has permission: ${role}`);
                    next();
                }
            });
        };
    }*/

    /*public static requireAccessToken(req: Request, res: Response, next: NextFunction) {
        Logger.debug(`AuthorizationHandler::requireAccessToken`);
        let accessToken: string | undefined;

        try {
            accessToken = req.header('Authorization')?.replace('Bearer ', '');
            if (accessToken === undefined) {
                throw new Error(`No Bearer token found in Authorization header`);
            } else {

                console.log(`accessToken = ${accessToken}`);
                jwt({
                 secret: jwtSecret,
                 //audience: jwtAudience,
                 // Validate the audience and the issuer.
                 audience: 'http://localhost:5000/.well-known/jwks.json',
                 algorithms: ['RS256'],
                 requestProperty: 'auth',
                 //issuer: `https://${auth0Domain}/`,
               }).unless({path: this.unprotected});

            }

            next();
        } catch (error: any) {
            unauthorised(error.message, res);
        }
    };*/

    public static permitAll(req: Request, res: Response, next: NextFunction) {
        Logger.debug(`AuthorizationHandler::permitAll`);
        next();
    }

    // updated to use express-jwt-permissions
    public static permitSelf(req: Request, res: Response, next: NextFunction) {
        Logger.debug(`AuthorizationHandler::permitSelf`);
        Logger.debug(`Verifying if user has authorization to self endpoint: '${req.url}`);
        const userId = req.session.userId;
        const role = req.session.role;
        if (role == 'admin' || (userId && req.url.includes(userId.toString()))) {
            Logger.debug(`UserId: '${userId}' has permission to access the endpoint: '${req.url}'`);
            next();
        } else {
            Logger.debug(`UserId '${userId}' does not have permission to access the endpoint: '${req.url}'`);
            forbidden(`User '${userId}' does not have permission to access the endpoint: '${req.url}'`, res);
        }
    }

    // NOTE: no longer required - delegated to JWT permissions
    public static permitAdmin(req: Request, res: Response, next: NextFunction) {
        Logger.debug(`AuthorizationHandler::permitAdmin`);
        Logger.debug(`Verifying if user has authorization to admin endpoint: '${req.url}`);
        Logger.debug(`Session is: ${JSON.stringify(req.session)}`)
        const email = req.session.email;
        const role = req.session.role;
        if (role == 'admin') {
            Logger.debug(`User: '${email}' has permission to access the endpoint: '${req.url}'`);
            next();
        } else {
            Logger.debug(`User '${email}' does not have permission to access the endpoint: '${req.url}'`);
            forbidden(`User '${email}' does not have permission to access the endpoint: '${req.url}'`, res);
        }
    }

}
