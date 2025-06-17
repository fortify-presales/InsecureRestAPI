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

import config from 'config';

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Database } from 'sqlite';

import Logger from "../middleware/logger";
import morganConfig from './morgan.config'
import errorHandler from "../middleware/error.handler";

require('dotenv').config();


class DbConfig {
    public db!: Database;
    private sqliteDb: string = config.has('App.sqliteConfig.database') ? config.get('App.sqliteConfig.database', ) : './iwa.db';

    constructor() {
    }

    public getDb(): Database {
        if (!this.db) {
            Logger.error('Database not initialized');
            throw new Error('Database not initialized');
        }
        return this.db;
    }

    public async initDb() {
        try {
            this.db = await open({
                filename: this.sqliteDb,
                driver: sqlite3.Database
            });
            Logger.debug(`Connected to SQLite database ${this.sqliteDb}`)
            await this.db.migrate({
                force: true
            });
            Logger.debug(`Migrated data to SQLite database ${this.sqliteDb}`)
        } catch (error) {
            Logger.error(error);
            process.exit(1);
        }
    }
}

export default new DbConfig();
