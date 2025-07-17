import {expect, jest, test, describe} from '@jest/globals';
import { EncryptUtils } from "../src/utils/encrypt.utils"; // Adjust the path as needed

describe("Encryption TestCases", () => {

    test("Encrypt password", () => {
        //Call function of 
        var enc = EncryptUtils.cryptPassword("ABCDE12345");
        // assertions
        expect(enc).toBe("acbf8a291bed749b6eeb");

    });

    test("Decrypt password", () => {
        //Call function of 
        var enc = EncryptUtils.decryptPassword("acbf8a291bed749b6eeb");
        // assertions
        expect(enc).toBe("ABCDE12345");
    });

    
    test("Compare passwords", () => {
        //Call function of 
        var enc = EncryptUtils.cryptPassword("ABCDE12345");
        // assertions
        expect(EncryptUtils.comparePassword("ABCDE12345", enc)).toBeTruthy;
        expect(EncryptUtils.comparePassword("12345ABCDE", enc)).toBeFalsy;
    });

});