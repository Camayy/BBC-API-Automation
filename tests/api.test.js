import { test, expect } from '@playwright/test';

const endpoint = "/wc-poll-data/container/sport-standings?urn=urn:bbc:sportsdata:rugby-union:tournament:six-nations";
const partialEndpoint = "/wc-poll-data/container/sport-standings?urn=urn:bbc:sportsdata:rugby-union:tournament:"

test.describe('API Tests - BBC Sport Standings', () => {
    test('GET request returns 200 and response time under 1000ms', async ({ request }) => {
        const startTime = Date.now();
        const response = await request.get(endpoint);
        const duration = Date.now() - startTime;

        expect(response.status()).toBe(200);
        expect(duration).toBeLessThan(1000);;
    });

    test('GET request should have a valid id and 6 participants', async ({ request }) => {
        const response = await request.get(endpoint);
        const responseBody = await response.json();

        expect(response.status()).toBe(200);

        expect(responseBody.id).not.toBeNull();
        expect(responseBody.id).not.toBe('');

        const { tournaments } = responseBody || {};
        const { stages } = tournaments?.[0] || {};
        const { rounds } = stages?.[0] || {};
        const { participants } = rounds?.[0] || {};

        expect(Array.isArray(participants)).toBe(true);
        expect(participants.length).toBe(6);
    });

    test('GET request returns data for a different competition', async ({ request }) => {

        const response = await request.get(partialEndpoint + 'world-cup');
        const responseBody = await response.json();

        expect(responseBody).not.toBeNull();
        expect(responseBody.tournaments?.[0]?.name).toContain('World Cup');
    });

    test('GET request returns 404 for a incorrect competition', async ({ request }) => {
        const response = await request.get(partialEndpoint + 'incorrect-competition');
        expect(response.status()).toBe(404);
    });

    test('GET request x-test-harness header is set correctly in the response and returns correctly', async ({ request }) => {
        const response = await request.get(endpoint, {
            headers: {
                'x-test-harness': 'true',
            },
        });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody).not.toBeNull();
        expect(responseBody).not.toBe('');

        const responseHeaders = response.headers();

        const currentDate = new Date(Date.now()).toUTCString().replace(/:\d{2} GMT/, ' GMT');

        //some fields missing due to not knowing how they are generated e.g. brequestid
        const expectedHeaders = {
            'access-control-allow-origin': '*',
            'belfrage-cache-status': 'MISS',
            'bid': 'cedric',
            'bsig': '367f914f4833f80ebaafdfb1246eb30e',
            'cache-control': 'public, stale-if-error=5, stale-while-revalidate=5, max-age=5',
            'connection': 'keep-alive',
            'content-encoding': 'gzip',
            'content-length': '663',
            'content-security-policy': expect.stringContaining('default-src'), 
            'content-type': 'application/json',
            'date': expect.stringContaining(currentDate),
            'etag': '"d9cf69cc4cc9918f407280067301ff79a464df1a"',
            'feature-policy': expect.stringContaining('accelerometer'), 
            'nel': '{"report_to":"default","max_age":2592000,"include_subdomains":true}',
            'permissions-policy': expect.stringContaining('accelerometer'),
            'referrer-policy': 'strict-origin-when-cross-origin',
            'req-svc-chain': 'cloudfront,BELFRAGE',
            'server': 'Belfrage',
            'strict-transport-security': 'max-age=604800',
            'vary': 'Accept-Encoding',
            'x-content-type-options': 'nosniff',
            'x-frame-options': 'DENY',
            'x-xss-protection': '1; mode=block',
          };

          for (const [header, expectedValue] of Object.entries(expectedHeaders)) {
            if (typeof expectedValue === 'string') {
                expect(responseHeaders[header], `Header "${header}" value is incorrect`).toBe(expectedValue);
              } else if (expectedValue instanceof Function) {
                expectedValue(responseHeaders[header]);
              }
          }
    });
});