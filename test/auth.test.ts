/* eslint-disable prettier/prettier */
import "dotenv/config";
import { buildApp } from "@app/build";
import { sqlCon } from "@common/config/kysely-config";
import * as userRepository from "@user/repository.user";
import assert from "node:assert/strict";
import { test } from "node:test";
import { faker } from '@faker-js/faker';
import { verifyJwt } from "@shared/utils/jwt-utils";
import { JwtTypes } from "@common/enum/jwt-types";
import bcrypt from "bcrypt";

test("Positive signup new user", async () => {
    const fastify = await buildApp();

    const payload = {
        email: faker.internet.email(),
        password: faker.internet.password()
    };

    const response = await fastify.inject({
        method: "POST",
        url: "/users/signup",
        payload: payload
    });

    const body = response.json();

    const user = await userRepository.getByEmail(sqlCon, payload.email);

    assert(user, "User should exist in database");
    assert.notStrictEqual(user.password, payload.password);
    assert.strictEqual(typeof body.id, "string");
    assert.match(body.id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    assert.strictEqual(response.statusCode, 201);

    await fastify.close();
});

test("Positive login user", async () => {
    const fastify = await buildApp();

    const payload = {
        email: faker.internet.email(),
        password: faker.internet.password()
    };

    const hashPassword = await bcrypt.hash(payload.password, 5);

    await userRepository.insert(sqlCon, { email: payload.email, password: hashPassword });

    const response = await fastify.inject({
        method: "POST",
        url: "/users/login",
        payload: payload
    });

    const { id, accessToken, refreshToken } = response.json();

    assert.strictEqual(typeof id, 'string');
    assert.strictEqual(typeof accessToken, 'string');
    assert.strictEqual(typeof refreshToken, 'string');

    const accessPayload = verifyJwt(accessToken, JwtTypes.ACCESS);
    assert.deepStrictEqual(
        {
            id: accessPayload.id,
            type: accessPayload.type,
            role: accessPayload.role
        },
        {
            id: id,
            type: JwtTypes.ACCESS,
            role: "user"
        },
        'Access token payload mismatch'
    );

    const refreshPayload = verifyJwt(refreshToken, JwtTypes.REFRESH);
    assert.deepStrictEqual(
        {
            id: refreshPayload.id,
            type: refreshPayload.type,
            role: refreshPayload.role
        },
        {
            id: id,
            type: JwtTypes.REFRESH,
            role: "user"
        },
        'Refresh token payload mismatch'
    );

    assert.strictEqual(response.statusCode, 200);

    await fastify.close();
});
