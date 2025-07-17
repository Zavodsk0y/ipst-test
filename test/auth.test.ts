/* eslint-disable prettier/prettier */
import { buildApp } from "@app/build";
import { sqlCon } from "@common/config/kysely-config";
import * as userRepository from "@user/repository.user";
import "dotenv/config";
import assert from "node:assert/strict";
import { test } from "node:test";

test("Positive signup new user", async () => {
    const fastify = await buildApp();

    const payload = {
        email: "test@example.com",
        password: "12345678"
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
