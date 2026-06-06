process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRefreshToken, rotateRefreshToken, revokeRefreshToken } from '../src/controllers/authController.js';
import { verifyRefreshTokenJwt, hashToken } from '../src/utils/tokenUtils.js';

const makeMockUser = () => {
  const user = {
    _id: '000000000000000000000001',
    refreshTokens: [],
    saved: false,
    async save() {
      this.saved = true;
    }
  };
  return user;
};

describe('Auth refresh token rotation and revocation', () => {
  it('creates a refresh token and stores the token hash', async () => {
    const user = makeMockUser();

    const refreshToken = await createRefreshToken(user);

    assert.ok(typeof refreshToken === 'string');
    assert.ok(refreshToken.split('.').length === 3, 'Expected a JWT refresh token');
    assert.ok(user.refreshTokens.length === 1, 'Expected refresh token to be stored');
    assert.ok(user.saved, 'Expected user save to be called');

    const decoded = verifyRefreshTokenJwt(refreshToken);
    assert.strictEqual(decoded.type, 'refresh');
    assert.strictEqual(decoded.sub, user._id.toString());
  });

  it('rotates refresh tokens and removes the previous token', async () => {
    const user = makeMockUser();

    const firstToken = await createRefreshToken(user);
    const secondToken = await rotateRefreshToken(user, firstToken);

    assert.notStrictEqual(firstToken, secondToken, 'Expected rotated refresh tokens to differ');
    assert.strictEqual(user.refreshTokens.length, 1, 'Expected only one active refresh token after rotation');
    assert.ok(verifyRefreshTokenJwt(secondToken), 'Expected new refresh token to be valid');
  });

  it('revokes a refresh token from the user record', async () => {
    const user = makeMockUser();

    const tokenOne = await createRefreshToken(user);
    const tokenTwo = await createRefreshToken(user);
    assert.strictEqual(user.refreshTokens.length, 2);

    await revokeRefreshToken(user, tokenOne);
    assert.strictEqual(user.refreshTokens.length, 1, 'Expected matching refresh token to be revoked');
    assert.ok(user.refreshTokens.some((item) => item.tokenHash !== hashToken(tokenOne)), 'Expected remaining token to be the second token');

    await revokeRefreshToken(user, tokenTwo);
    assert.strictEqual(user.refreshTokens.length, 0, 'Expected matching refresh token to be revoked');
  });
});
