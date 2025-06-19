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

var crypto = require('crypto-browserify')

import Logger from "../middleware/logger";

export abstract class EncryptUtils {

    static jwtSecret = process.env.JWT_SECRET || "your-very-long-and-random-secret-key";
    static jwtExpiration = '1h'; // 1 hour
    static jwtRefreshExpiration = '7d'; // 7 days
    static jwtIssuer = 'InsecureRestAPI';
    static jwtAudience = 'InsecureRestAPIUsers';
    static jwtAlgorithm = 'HS256';
    static encryptionKey = "";
    static algorithm = 'aes-256-ctr';

    public static cryptPassword(password: String): String {
        //process.stdout.write("Encrypting password: " + password);
        var cipher = crypto.createCipher(this.algorithm, this.encryptionKey);
        var mystr = cipher.update(password, 'utf8', 'hex');
        mystr += cipher.final('hex');
        process.stdout.write("Encrypted password:" + mystr);
        return mystr;
    }

    public static decryptPassword(hashPassword: String): String {
        process.stdout.write("Decrypting password: " + hashPassword);
        var cipher = crypto.createDecipher(this.algorithm, this.encryptionKey);
        var mystr = cipher.update(hashPassword, 'hex', 'utf8');
        mystr += cipher.final('utf8');
        process.stdout.write("Decrypted password:" + mystr);
        return mystr;
    }

    public static comparePassword(password: String, hashPassword: String): Boolean {
        //process.stdout.write("Encrypted password: " + hashPassword);
        var cipher = crypto.createDecipher(this.algorithm, this.encryptionKey);
        var mystr = cipher.update(hashPassword, 'hex', 'utf8');
        mystr += cipher.final('utf8');
        process.stdout.write("Comparing passwords: " + mystr + " = " + password);
        return (password == mystr);
    }

}
