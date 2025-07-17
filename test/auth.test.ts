/* eslint-disable prettier/prettier */
import "dotenv/config";
import { buildApp } from "@app/build";
import assert from "node:assert/strict";
import { test } from "node:test";

test("Signup new user", async () => {
    const fastify = await buildApp();

    const response = await fastify.inject({
        method: "POST",
        url: "/users/signup",
        payload: {
            email: "test@example.com",
            password: "12345678"
        }
    });

    assert.strictEqual(response.statusCode, 201);
    await fastify.close();
});
