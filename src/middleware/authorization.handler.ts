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

import Logger from "./logger";
import config from "config";
import {NextFunction, Request, Response} from "express";
import {forbidden, unauthorised} from "../modules/common/service";

const { expressjwt: jwt } = require("express-jwt");
const jwtAuthz = require("express-jwt-authz");

import jwksRsa from "jwks-rsa";

const staticAccessToken: string = config.get('App.staticAccessToken') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const auth0Domain: string = config.get('App.auth0.domain');
const auth0Audience: string = config.get('App.auth0.audience');

export class AuthorizationHandler {

    // routes open to all
    private static unprotected = [
        /\//,
        /\/api-docs/,
        /\/api-docs\/*/,
        /favicon.ico/,
        /\/site\/*/,
    ];

    /*public static checkJwt = jwt({
        secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://${auth0Domain}/.well-known/jwks.json`
        }),

        // Validate the audience and the issuer.
        audience: `${auth0Audience}`,
        issuer: `https://${auth0Domain}/`,
        algorithms: ["RS256"]
    }).unless({path: this.unprotected})
    */
   
    public static requirePermission(permissions: string | string[]) {
        try {
            const jwtAuth = jwtAuthz([permissions], {
                customScopeKey: "permissions",
                customUserKey: "auth",
                checkAllScopes: true,
                failWithError: false // should be true and catch with custom error handler
            });
            return jwtAuth;
        } catch (error: any) {
            unauthorised(error.message, res);
        }
    };

    public static requireAccessToken(req: Request, res: Response, next: NextFunction) {
        Logger.debug(`AuthorizationHandler::requireAccessToken`);
        let accessToken: string | undefined;

        try {
            accessToken = req.header('Authorization')?.replace('Bearer ', '');
            if (accessToken === undefined) {
                throw new Error(`No Bearer token found in Authorization header`);
            } else {

                console.log(`accessToken = ${accessToken}`);
                const jwtAccess = jwt({
                 secret: jwksRsa.expressJwtSecret({
                   cache: true,
                   rateLimit: true,
                   jwksRequestsPerMinute: 5,
                   jwksUri: `https://${auth0Domain}/.well-known/jwks.json`
                 }),

                 // Validate the audience and the issuer.
                 audience: 'https://iwa-api.onfortify.com',
                 issuer: `https://${auth0Domain}/`,
                 algorithms: ["RS256"]
               }).unless({path: this.unprotected});

            }

            next();
        } catch (error) {
            unauthorised(error.message, res);
        }
    };

    public static permitAll(req: Request, res: Response, next: NextFunction) {
        Logger.debug(`AuthorizationHandler::permitAll`);
        next();
    }

    // TODO: update for Auth0
    public static permitSelf(req: Request, res: Response, next: NextFunction) {
        Logger.debug(`AuthorizationHandler::permitSelf`);
        Logger.debug(`Verifying if user has authorization to self endpoint: '${req.url}`);
        const userId = req.session.userId;
        const email = req.session.email;
        const role = req.session.role;
        if (role == 'admin' || (userId && req.url.includes(userId.toString()))) {
            Logger.debug(`UserId: '${userId}' has permission to access the endpoint: '${req.url}'`);
            next();
        } else {
            Logger.debug(`UserId '${userId}' does not have permission to access the endpoint: '${req.url}'`);
            forbidden(`User '${userId}' does not have permission to access the endpoint: '${req.url}'`, res);
        }
    }

    // NOTE: no longer required - delegated to Auth0 permissions
    public static permitAdmin(req: Request, res: Response, next: NextFunction) {
        Logger.debug(`AuthorizationHandler::permitAdmin`);
        Logger.debug(`Verifying if user has authorization to admin endpoint: '${req.url}`);
        Logger.debug(`Session is: ${JSON.stringify(req.session)}`)
        const userId = req.session.userId;
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
