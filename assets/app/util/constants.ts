/**
 * Created by Thisum on 8/16/2016.
 */

export const BASE_URL = 'http://localhost:8080';

/**
 * Defines response statuses. Should be used to determine status of the server communication
 * @type {number}
 */
export enum SERVER_RESPONSE_STATUS{
    SUCCESS = 1000,
    FAILED = 2000,
    WARNING = 3000
};

export const SCHEMA_TYPE_FREE = "Free";
export const SCHEMA_TYPE_VALUE_UNLIMITED = "Unlimited";

