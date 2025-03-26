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

import swaggerAutogen from 'swagger-autogen';
import config from 'config';

const appName: string = config.get('App.name') || "IWA-API";
const appVersion: string = config.get('App.version') || "1.0.0";
const appDescription: string = config.get('App.description') || "";
const apiUrl: string = config.get('App.apiConfig.url') || "http://localhost:3000/api-docs/";
const apiDesc: string = config.get('App.apiConfig.description') || "Development server"

const doc = {
    info: {
        title: `${appName}`,
        version: `${appVersion}`,
        description: `${appDescription}`,
        license: {
            name: "GPLv3",
            url: "https://www.gnu.org/licenses/gpl-3.0.en.html",
        },
        contact: {
            name: "Fortify by Opentext",
            url: "https://www.microfocus.com/en-us/cyberres/application-security",
        }
    },
    components: {
        schemas: {
            user: {
                $user_id: "auth0|6634fe351045dd069fb881af",
                $name: {
                    $first_name: "User",
                    $middle_name: "",
                    $last_name: "One"
                },
                $email: "user1@localhost.com",
                $phone_number: "1234567890",
                $address: {
                    $street: "string",
                    $city: "string",
                    $state: "string",
                    $zip: "string",
                    $country: "string",
                },
                $is_enabled: true,
                $is_admin: false,
            },
            registerUser: {
                $user_id: "auth0|6634fe351045dd069fb881af",
                $first_name: "User",
                $last_name: "One",
                $email: "user1@localhost.com",
                $phone_number: "1234567890",
            },
            subscribeUser: {
                $first_name: "User",
                $last_name: "One",
                $email: "user1@localhost.com"
            },
            signInUser: {
                $email: "string",
                $password: "string"
            },
            signOutUser: {
                $accessToken: "string"
            },
            refreshUser: {
                $refreshToken: "string"
            },
            product: {
                $code: "SWA-123-456-789",
                $name: "Product Name",
                $summary: "An example summary.",
                $description: "This is an example description of the product.",
                $image: "image-filename",
                $price: 10.0,
                $on_sale: false,
                $sale_price: 10.0,
                $in_stock: true,
                $time_to_stock: 0,
                $rating: 1,
                $available: true
            },
            message: {
                $user_id: "auth0|6634fe351045dd069fb881af",
                $text: "This is an example message",
                $sent_date: "YYYY-MM-DDTHH:mm:ssZ",
                $read_date: "YYYY-MM-DDTHH:mm:ssZ",
                $is_read: true,
                $is_deleted: false
            },
            success: {
                $status: "success",
                $message: "string",
                $timestamp: "YYYY-MM-DDTHH:mm:ssZ",
                $data: {}
            },
            failure: {
                $status: "failure",
                $message: "string",
                $timestamp: "YYYY-MM-DDTHH:mm:ssZ",
                $data: {}
            }
        },
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                description: 'Access Token'
            }
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    servers: [
        {
            url: "https://iwa-api.onfortify.com",
            description: "Production server"
        },
        {
            url: `${apiUrl}`,
            description: `${apiDesc}`
        },
    ]
};

const outputFile = './swagger_output.json';
const endpointsFiles = [
    '../routes/site.routes.ts', 
    '../routes/product.routes.ts',
    '../routes/message.routes.ts'
    //'../routes/user.routes.ts',
];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);
